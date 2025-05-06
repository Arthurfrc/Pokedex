import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@/navigation/StackNavigator';
import { Pokemon, Team } from '@/types/Pokemon';
import { fetchPokemonList, fetchPokemonDetails } from '@/services/pokeApi';
import PokemonCard from '@/components/PokemonCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { saveTeam, getTeams } from '@/services/teamService';

type TeamBuilderScreenProps = {};

const TeamBuilderScreen: React.FC<TeamBuilderScreenProps> = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Pokemon[]>([]);
  const [teamName, setTeamName] = useState('My New Team');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load initial pokemon data
  useEffect(() => {
    loadPokemon();
  }, []);

  // Filter pokemon when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPokemon(pokemonList);
    } else {
      const filtered = pokemonList.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(pokemon.id).includes(searchQuery)
      );
      setFilteredPokemon(filtered);
    }
  }, [searchQuery, pokemonList]);

  const loadPokemon = async () => {
    try {
      setIsLoading(true);
      const pokemonData = await fetchPokemonList(page, 20);
      
      if (pokemonData.length === 0) {
        setHasMore(false);
      } else {
        // Get detailed information for each Pokemon
        const detailedPokemon = await Promise.all(
          pokemonData.map(async (pokemon) => {
            const details = await fetchPokemonDetails(pokemon.name);
            return {
              id: details.id,
              name: details.name,
              types: details.types.map((type: any) => type.type.name),
              sprite: details.sprites.front_default,
              stats: details.stats.map((stat: any) => ({
                name: stat.stat.name,
                value: stat.base_stat
              }))
            };
          })
        );
        
        setPokemonList(prev => [...prev, ...detailedPokemon]);
      }
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
      loadPokemon();
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleSelectPokemon = (pokemon: Pokemon) => {
    if (selectedTeam.length < 6 && !selectedTeam.some(p => p.id === pokemon.id)) {
      setSelectedTeam(prev => [...prev, pokemon]);
    }
  };

  const handleRemovePokemon = (pokemonId: number) => {
    setSelectedTeam(prev => prev.filter(pokemon => pokemon.id !== pokemonId));
  };

  const handleSaveTeam = async () => {
    if (selectedTeam.length === 0) {
      alert('Please add at least one Pokémon to your team');
      return;
    }

    const team: Team = {
      id: Date.now().toString(),
      name: teamName,
      pokemon: selectedTeam,
      createdAt: new Date().toISOString()
    };

    try {
      await saveTeam(team);
      alert('Team saved successfully!');
      navigation.navigate('Teams');
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Failed to save team');
    }
  };

  const renderEmptySlot = (index: number) => (
    <View style={styles.emptySlot} key={`empty-${index}`}>
      <Text style={styles.emptySlotText}>+</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Team Builder</Text>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveTeam}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.teamNameContainer}>
        <TextInput
          style={styles.teamNameInput}
          value={teamName}
          onChangeText={setTeamName}
          placeholder="Team Name"
        />
      </View>

      <View style={styles.teamContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedTeam.map((pokemon) => (
            <TouchableOpacity 
              key={`team-${pokemon.id}`}
              style={styles.teamSlot}
              onPress={() => handleRemovePokemon(pokemon.id)}
            >
              <Image 
                source={{ uri: pokemon.sprite }} 
                style={styles.teamPokemonImage} 
              />
              <Text style={styles.teamPokemonName}>
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          {Array.from({ length: 6 - selectedTeam.length }).map((_, i) => 
            renderEmptySlot(i)
          )}
        </ScrollView>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Pokémon by name or number"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <Text style={styles.sectionTitle}>Pokémon List</Text>
      
      <ScrollView 
        style={styles.pokemonList}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={styles.pokemonGrid}>
          {filteredPokemon.map((pokemon) => (
            <TouchableOpacity 
              key={pokemon.id}
              style={styles.pokemonItem}
              onPress={() => handleSelectPokemon(pokemon)}
            >
              <PokemonCard pokemon={pokemon} compact />
            </TouchableOpacity>
          ))}
        </View>
        {isLoading && <LoadingSpinner />}
        {!hasMore && <Text style={styles.endListText}>No more Pokémon to load</Text>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#D53B47',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  saveButtonText: {
    color: '#D53B47',
    fontWeight: 'bold',
  },
  teamNameContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teamNameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  teamContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teamSlot: {
    width: 80,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  teamPokemonImage: {
    width: 60,
    height: 60,
  },
  teamPokemonName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  emptySlot: {
    width: 80,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  emptySlotText: {
    fontSize: 24,
    color: '#aaa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
  },
  pokemonList: {
    flex: 1,
  },
  pokemonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  pokemonItem: {
    width: '48%',
    marginBottom: 16,
  },
  endListText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  }
});

export default TeamBuilderScreen;