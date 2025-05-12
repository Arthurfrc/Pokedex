import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';
import theme from '@/theme';
import { TypeIcon } from '@/components/TypeIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonList'>;

type PokemonType =
    | 'Water' | 'Steel' | 'Rock' | 'Psychic' | 'Poison' | 'Normal'
    | 'Ice' | 'Ground' | 'Grass' | 'Ghost' | 'Flying' | 'Fire'
    | 'Fairy' | 'Fighting' | 'Electric' | 'Dragon' | 'Dark' | 'Bug';

type Pokemon = {
    id: number;
    name: string;
    types: PokemonType[];
    sprite: string;
};

const POKEMON_TYPES: PokemonType[] = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic',
    'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
];

export default function PokemonListScreen({ navigation }: Props) {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);

    useEffect(() => {
        fetchPokemons();
    }, []);

    const fetchPokemons = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
            const data = await response.json();

            const pokemonDetails = await Promise.all(
                data.results.map(async (pokemon: { name: string; url: string }) => {
                    const res = await fetch(pokemon.url);
                    const details = await res.json();
                    return {
                        id: details.id,
                        name: details.name,
                        types: details.types.map((type: any) =>
                            type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
                        ) as PokemonType[],
                        sprite: details.sprites.front_default,
                    };
                })
            );

            setPokemons(pokemonDetails);
        } catch (err) {
            setError('Erro ao carregar Pokémons');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleType = (type: PokemonType) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const filteredPokemons = pokemons.filter(pokemon => {
        const matchesSearch = pokemon.name.toLowerCase().includes(searchText.toLowerCase()) ||
            pokemon.id.toString().includes(searchText);
        const matchesTypes = selectedTypes.length === 0 ||
            selectedTypes.every(type => pokemon.types.includes(type));
        return matchesSearch && matchesTypes;
    });

    const renderTypeChip = (type: PokemonType) => (
        <TouchableOpacity
            key={type}
            style={[
                styles.typeChip,
                selectedTypes.includes(type) && styles.selectedTypeChip
            ]}
            onPress={() => toggleType(type)}
        >
            <View style={[
                styles.typeIconWrapper,
                !selectedTypes.includes(type) && styles.unselectedTypeIcon
            ]}>
                <TypeIcon type={type} size={28} />
            </View>
        </TouchableOpacity>
    );

    const renderPokemonItem = ({ item }: { item: Pokemon }) => (
        <TouchableOpacity style={styles.pokemonCard}>
            <Text style={styles.pokemonNumber}>#{item.id.toString().padStart(3, '0')}</Text>
            <Text style={styles.pokemonName}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </Text>
            <View style={styles.typeContainer}>
                {item.types.map(type => (
                    <View key={type}>
                        <TypeIcon type={type} size={24} />
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por nome ou número..."
                        placeholderTextColor="#666"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                <View style={styles.typesContainer}>
                    <View style={styles.typesGrid}>
                        {POKEMON_TYPES.map(renderTypeChip)}
                    </View>
                </View>
            </View>

            <FlatList
                data={filteredPokemons}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPokemonItem}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerContainer: {
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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
    searchContainer: {
        padding: 16,
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#000',
    },
    typesContainer: {
        height: 120,
        paddingVertical: 8,
    },
    typesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeChip: {
        padding: 4,
        height: 32,
        width: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedTypeChip: {
        opacity: 1,
    },
    typeIconWrapper: {
        opacity: 1,
    },
    unselectedTypeIcon: {
        opacity: 0.4,
    },
    listContainer: {
        padding: 16,
    },
    pokemonCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pokemonNumber: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    pokemonName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});