import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Searchbar, Chip, Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import MoveCard from '../components/MoveCard';
import { movesMock } from '../data/movesMock';
import { Move } from '../types/Move';
import { PokemonType } from '../types/Pokemon';
import theme from '../theme';

type MovesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Moves'>;

const MovesScreen = () => {
    const navigation = useNavigation<MovesScreenNavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
    const [filteredMoves, setFilteredMoves] = useState<Move[]>(movesMock);
    const [isLoading, setIsLoading] = useState(false);

    const pokemonTypes: PokemonType[] = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic',
        'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];

    useEffect(() => {
        filterMoves();
    }, [searchQuery, selectedTypes]);

    const filterMoves = () => {
        setIsLoading(true);

        // Simular um pequeno delay para mostrar o loading (apenas para demonstração)
        setTimeout(() => {
            let filtered = [...movesMock];

            // Filtrar por pesquisa
            if (searchQuery) {
                filtered = filtered.filter(move =>
                    move.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            // Filtrar por tipos selecionados
            if (selectedTypes.length > 0) {
                filtered = filtered.filter(move =>
                    selectedTypes.includes(move.type)
                );
            }

            setFilteredMoves(filtered);
            setIsLoading(false);
        }, 300);
    };

    const toggleTypeFilter = (type: PokemonType) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    const onMovePress = (move: Move) => {
        navigation.navigate('MoveDetails', { move });
    };

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Buscar movimentos..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
                iconColor="#FFFFFF"
                inputStyle={{ color: '#FFFFFF' }}
            />

            <View style={styles.typesContainer}>
                <FlatList
                    data={pokemonTypes}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Chip
                            selected={selectedTypes.includes(item)}
                            onPress={() => toggleTypeFilter(item)}
                            style={[
                                styles.typeChip,
                                { backgroundColor: selectedTypes.includes(item) ? theme.pokemonColors[item] : 'rgba(255, 255, 255, 0.1)' }
                            ]}
                            textStyle={{
                                color: selectedTypes.includes(item) ? '#FFFFFF' : '#CCCCCC',
                                fontWeight: selectedTypes.includes(item) ? 'bold' : 'normal'
                            }}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </Chip>
                    )}
                    keyExtractor={item => item}
                    contentContainerStyle={styles.typesList}
                />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF5350" />
                </View>
            ) : filteredMoves.length > 0 ? (
                <FlatList
                    data={filteredMoves}
                    renderItem={({ item }) => (
                        <MoveCard move={item} onPress={onMovePress} />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.movesList}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Nenhum movimento encontrado para os filtros selecionados.
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#121212',
    },
    searchbar: {
        marginBottom: 12,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        elevation: 2,
    },
    typesContainer: {
        marginBottom: 16,
    },
    typesList: {
        paddingVertical: 8,
    },
    typeChip: {
        marginRight: 8,
        borderRadius: 20,
    },
    movesList: {
        paddingBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
    },
});

export default MovesScreen;