import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ActivityIndicator,
    ScrollView, Dimensions, FlatList, TouchableOpacity
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';

import theme from '@/theme';
import PokeballSvg from '../../assets/pokeball-rgb.svg';
import pokemonGifs from '../../assets/PokemonGifs';

async function translateText(text: string): Promise<string> {
    try {
        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt-BR`
        );
        const json = await res.json();

        // Verifica se há algum erro ou limite excedido
        if (json.responseStatus !== 200 || json.responseData.translatedText.includes("MYMEMORY WARNING")) {
            return text; // Retorna o texto original em caso de erro
        }

        return json.responseData?.translatedText ?? text;
    } catch {
        return text;
    }
}

type Props = NativeStackScreenProps<RootStackParamList, 'AbilityDetail'>;

type AbilityDetail = {
    name: string;
    effect_entries: {
        effect: string;
        language: { name: string };
        short_effect: string;
    }[];
    pokemon: {
        pokemon: {
            name: string;
            url: string;
        };
    }[];
};

type Pokemon = {
    name: string;
    url: string;
    id: number;
};

// Calcular largura das colunas com base na tela
const { width } = Dimensions.get('window');
const numColumns = 2;
const columnWidth = (width * 0.9) / numColumns;

export default function AbilityDetailScreen({ route, navigation }: Props) {
    const { abilityName, abilityUrl } = route.params;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [abilityDetail, setAbilityDetail] = useState<AbilityDetail | null>(null);
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [description, setDescription] = useState<string>('');
    const [translating, setTranslating] = useState<boolean>(false);
    const [isTranslated, setIsTranslated] = useState<boolean>(false);
    const [originalDescription, setOriginalDescription] = useState<string>('');
    const [translatedDescription, setTranslatedDescription] = useState<string>('');

    // Função para limpar o nome do Pokémon removendo variações específicas
    const cleanPokemonName = (name: string): string => {
        // Casos especiais que queremos manter
        if (name.endsWith('-gmax') || name.endsWith('-mega')) {
            return name;
        }
        
        // Caso especial do Nidoran
        if (name.startsWith('nidoran') && (name.endsWith('-m') || name.endsWith('-f'))) {
            return name;
        }

        // Para todos os outros casos, remove tudo após o primeiro hífen
        const firstHyphenIndex = name.indexOf('-');
        if (firstHyphenIndex !== -1) {
            return name.substring(0, firstHyphenIndex);
        }

        return name;
    };

    useEffect(() => {
        fetch(abilityUrl)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setAbilityDetail(data);

                // Extrair e processar lista de pokémon
                if (data.pokemon && Array.isArray(data.pokemon)) {
                    const processed = data.pokemon.map((item: { pokemon: { name: string; url: string } }) => {
                        // Extrai o ID da URL (formato: https://pokeapi.co/api/v2/pokemon/25/)
                        const urlParts = item.pokemon.url.split('/');
                        const id = parseInt(urlParts[urlParts.length - 2] || '0');

                        return {
                            name: item.pokemon.name,
                            url: item.pokemon.url,
                            id
                        };
                    });

                    // Remover duplicatas baseadas no nome limpo
                    const uniquePokemon = processed.reduce((acc: Pokemon[], curr: Pokemon) => {
                        const cleanedName = cleanPokemonName(curr.name);
                        // Verifica se já existe um Pokémon com o nome limpo
                        const exists = acc.some(p => cleanPokemonName(p.name) === cleanedName);
                        if (!exists) {
                            acc.push(curr);
                        }
                        return acc;
                    }, []);

                    // Ordenar por ID para ter ordem da Pokédex
                    setPokemonList(uniquePokemon.sort((a: Pokemon, b: Pokemon) => a.id - b.id));
                }

                // Obter descrição e configurar
                const desc = getDescriptionFromData(data);
                setDescription(desc);

                // Verificar se a descrição original é em inglês
                const ptDesc = data.effect_entries.find(
                    (entry) => entry.language.name === 'pt-br'
                );

                const enDesc = data.effect_entries.find(
                    (entry) => entry.language.name === 'en'
                );

                // Se já temos em pt-br, não precisamos traduzir
                if (ptDesc) {
                    setIsTranslated(true);
                } else if (enDesc) {
                    // Guardar descrição original em inglês
                    setOriginalDescription(enDesc.effect || '');
                    // Traduzir automaticamente
                    translateDescription(enDesc.effect || '');
                }
            })
            .catch((err) => {
                console.error(err);
                setError('Não foi possível carregar os detalhes da habilidade');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [abilityUrl]);

    // Função para formatar o nome do Pokémon
    const formatPokemonName = (name: string) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    // Obtém a descrição em português ou inglês dos dados da API
    const getDescriptionFromData = (data: AbilityDetail): string => {
        if (!data) return 'Descrição não disponível';

        // Procura por descrição em português
        const ptDesc = data.effect_entries.find(
            (entry) => entry.language.name === 'pt-br'
        );

        // Se não encontrar em português, usa inglês
        const enDesc = data.effect_entries.find(
            (entry) => entry.language.name === 'en'
        );

        return ptDesc?.effect || enDesc?.effect || 'Descrição não disponível';
    };

    // Função para traduzir a descrição
    const translateDescription = async (text: string) => {
        if (text === 'Descrição não disponível' || !text) return;

        // Se já temos uma tradução salva, use-a em vez de chamar a API novamente
        if (translatedDescription) {
            setDescription(translatedDescription);
            setIsTranslated(true);
            return;
        }

        setTranslating(true);
        try {
            const translated = await translateText(text);
            if (translated !== text) {
                // Salva a tradução na memória
                setTranslatedDescription(translated);
                setDescription(translated);
                setIsTranslated(true);
            }
        } catch (err) {
            console.error("Erro na tradução:", err);
        } finally {
            setTranslating(false);
        }
    };

    // Alternar entre descrição traduzida e original
    const toggleDescription = () => {
        if (isTranslated && originalDescription) {
            // Mostra a versão original
            setDescription(originalDescription);
            setIsTranslated(false);
        } else if (originalDescription) {
            // Mostra a versão traduzida (que pode ser carregada da memória)
            if (translatedDescription) {
                // Usa a tradução já armazenada
                setDescription(translatedDescription);
                setIsTranslated(true);
            } else {
                // Se ainda não temos uma tradução, chama a função de tradução
                translateDescription(originalDescription);
            }
        }
    };

    // Renderiza um item de pokémon com imagem e nome
    const PokemonItem = React.memo(({ item }: { item: Pokemon }) => {
        const [imgLoaded, setImgLoaded] = useState(false);
        const [imgError, setImgError] = useState(false);
        const [usePng, setUsePng] = useState(false);

        // calcula chave de lookup
        const id4 = String(item.id).padStart(4, '0');
        const slug = item.name.toLowerCase();
        const mapKey = `${id4}-${slug}`;

        // Debug: imprime exatamente o que está tentando carregar
        console.log(
            `POKÉMON DEBUG: ${item.name} (ID=${item.id})`,
            `\n- mapKey: ${mapKey}`,
            `\n- Exists in pokemonGifs: ${pokemonGifs[mapKey] ? 'YES' : 'NO'}`
        );

        // tenta GIF local
        const localGif = (pokemonGifs as any)[mapKey];
        const remoteGif = { uri: `https://play.pokemonshowdown.com/sprites/ani/${slug}.gif` };
        const gifSource = localGif ?? remoteGif;
        const pngUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id4}.png`;
        const pngSource = { uri: pngUrl };

        const source = imgError || usePng
            ? pngSource
            : gifSource;

        return (
            <View style={[styles.pokemonItem, { width: columnWidth - 16 }]}>
                <View style={styles.imageContainer}>
                    {(!imgLoaded || imgError) && (
                        <View style={styles.placeholderContainer}>
                            <PokeballSvg width={40} height={40} />
                        </View>
                    )}
                    <ExpoImage
                        source={source}
                        contentFit="contain"
                        style={[
                            styles.pokemonImage,
                            !imgLoaded && { opacity: 0 }
                        ]}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => {
                            if (!imgError) {
                                setImgError(true);
                                setUsePng(true);
                            }
                        }}
                    />
                </View>
                <Text style={styles.pokemonName}>
                    {formatPokemonName(item.name)}
                </Text>
                <Text style={styles.debugText}>
                    {localGif
                        ? 'LOCAL GIF'
                        : usePng
                            ? 'PNG fallback'
                            : remoteGif.uri
                    }
                </Text>
            </View>
        );
    });

    const renderPokemonItem = ({ item }: { item: Pokemon }) => {
        return <PokemonItem item={item} />;
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error || !abilityDetail) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error || 'Erro desconhecido'}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.abilityTitle}>
                        {abilityName.charAt(0).toUpperCase() + abilityName.slice(1).replace(/-/g, ' ')}
                    </Text>
                    <View style={{ marginBottom: theme.spacing.lg }}>
                        <View style={styles.descriptionHeader}>
                            <Text style={styles.sectionTitle}>Descrição</Text>
                            {originalDescription && (
                                <TouchableOpacity
                                    onPress={toggleDescription}
                                    disabled={translating}
                                    style={styles.translateButton}
                                >
                                    <Text style={styles.translateButtonText}>
                                        {translating ? 'Traduzindo...' : isTranslated ? 'Ver original' : 'Traduzir'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {translating ? (
                            <View style={styles.translatingContainer}>
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                                <Text style={styles.translatingText}>Traduzindo...</Text>
                            </View>
                        ) : (
                            <Text style={styles.description}>{description}</Text>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pokémons com esta habilidade</Text>

                    <FlatList
                        data={pokemonList}
                        keyExtractor={(item) => String(item.id)}
                        numColumns={numColumns}
                        renderItem={renderPokemonItem}
                        scrollEnabled={false} // Para funcionar dentro do ScrollView
                        contentContainerStyle={styles.pokemonGrid}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 16,
    },
    content: {
        flex: 1,
        padding: theme.spacing.md,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
        color: theme.colors.text,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: theme.colors.text,
    },
    pokemonGrid: {
        paddingVertical: theme.spacing.sm,
    },
    pokemonItem: {
        width: '48%',
        margin: 8,
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: 8,
        padding: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pokemonImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginBottom: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    pokemonName: {
        fontSize: 14,
        textAlign: 'center',
        color: theme.colors.text,
    },
    imageContainer: {
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    placeholderContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    abilityTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        marginVertical: theme.spacing.md,
    },
    translateButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 8,
    },
    translateButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    descriptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    translatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    translatingText: {
        marginLeft: 8,
        color: theme.colors.primary,
    },
});