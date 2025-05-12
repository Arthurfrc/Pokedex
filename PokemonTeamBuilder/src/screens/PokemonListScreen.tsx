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

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonList'>;

type Pokemon = {
    id: number;
    name: string;
    types: string[];
    sprite: string;
};

type PokemonType = {
    name: string;
    color: string;
};

const POKEMON_TYPES: PokemonType[] = [
    { name: 'normal', color: '#A8A878' },
    { name: 'fire', color: '#F08030' },
    { name: 'water', color: '#6890F0' },
    { name: 'electric', color: '#F8D030' },
    { name: 'grass', color: '#78C850' },
    { name: 'ice', color: '#98D8D8' },
    { name: 'fighting', color: '#C03028' },
    { name: 'poison', color: '#A040A0' },
    { name: 'ground', color: '#E0C068' },
    { name: 'flying', color: '#A890F0' },
    { name: 'psychic', color: '#F85888' },
    { name: 'bug', color: '#A8B820' },
    { name: 'rock', color: '#B8A038' },
    { name: 'ghost', color: '#705898' },
    { name: 'dragon', color: '#7038F8' },
    { name: 'dark', color: '#705848' },
    { name: 'steel', color: '#B8B8D0' },
    { name: 'fairy', color: '#EE99AC' },
];

export default function PokemonListScreen({ navigation }: Props) {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

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
                        types: details.types.map((type: any) => type.type.name),
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

    const toggleType = (type: string) => {
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
            key={type.name}
            style={[
                styles.typeChip,
                { backgroundColor: type.color },
                selectedTypes.includes(type.name) && styles.selectedTypeChip
            ]}
            onPress={() => toggleType(type.name)}
        >
            <Text style={styles.typeChipText}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </Text>
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
                    <View
                        key={type}
                        style={[
                            styles.typeBadge,
                            { backgroundColor: POKEMON_TYPES.find(t => t.name === type)?.color }
                        ]}
                    >
                        <Text style={styles.typeText}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
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
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nome ou número..."
                    placeholderTextColor="#666"
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.typesContainer}
                contentContainerStyle={styles.typesContent}
            >
                {POKEMON_TYPES.map(renderTypeChip)}
            </ScrollView>

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
        maxHeight: 50,
    },
    typesContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    typeChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    selectedTypeChip: {
        opacity: 0.7,
    },
    typeChipText: {
        color: '#fff',
        fontWeight: 'bold',
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
        color: '#666',
        fontSize: 14,
        marginBottom: 4,
    },
    pokemonName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});