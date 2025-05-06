import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Chip, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/StackNavigator';
import { Pokemon, PokemonFormData, Move } from '@/types/Pokemon';

type Props = StackScreenProps<RootStackParamList, 'PokemonDetails'>;

const POKEAPI_URL = 'https://pokeapi.co/api/v2';

const getSprite = (form: PokemonFormData, shiny: boolean) => {
  if (shiny && form.sprites.shiny) return form.sprites.shiny;
  if (shiny && form.sprites.animatedShiny) return form.sprites.animatedShiny;
  if (!shiny && form.sprites.animated) return form.sprites.animated;
  return form.sprites.default;
};

export default function PokemonDetailsScreen({ route }: Props) {
  const { pokemon } = route.params;
  const [data, setData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<PokemonFormData | null>(null);
  const [isShiny, setIsShiny] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const cacheKey = `pokemon-${pokemon.id}`;
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          setData(JSON.parse(cached));
          setSelectedForm(JSON.parse(cached).baseForm);
          setLoading(false);
          return;
        }
        const res = await fetch(`${POKEAPI_URL}/pokemon/${pokemon.id}`);
        const pokeData = await res.json();

        const baseForm: PokemonFormData = {
          name: pokemon.name,
          sprites: pokemon.sprites,
          stats: {
            hp: pokeData.stats[0].base_stat,
            attack: pokeData.stats[1].base_stat,
            defense: pokeData.stats[2].base_stat,
            specialAttack: pokeData.stats[3].base_stat,
            specialDefense: pokeData.stats[4].base_stat,
            speed: pokeData.stats[5].base_stat,
          },
        };

        const moves: Move[] = pokeData.moves.map((m: any) => ({
          id: 0,
          name: m.move.name,
          type: '',
          category: '',
          description: '',
          pp: 0,
          method: m.version_group_details[0]?.move_learn_method.name || 'other',
          level: m.version_group_details[0]?.level_learned_at,
        }));

        const fullData: Pokemon = {
          ...pokemon,
          baseForm,
          forms: pokemon.forms || [],
          moves,
        };

        await AsyncStorage.setItem(cacheKey, JSON.stringify(fullData));
        setData(fullData);
        setSelectedForm(baseForm);
      } catch (e) {
        const cached = await AsyncStorage.getItem(`pokemon-${pokemon.id}`);
        if (cached) {
          setData(JSON.parse(cached));
          setSelectedForm(JSON.parse(cached).baseForm);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [pokemon]);

  if (loading || !data || !selectedForm) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={{ color: '#fff', marginTop: 16 }}>Carregando dados do Pokémon...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.bg}>
      <View style={styles.container}>
        {/* Sprite e seleção de shiny */}
        <View style={styles.spriteContainer}>
          <Image
            source={{ uri: getSprite(selectedForm, isShiny) }}
            style={styles.sprite}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => setIsShiny((s) => !s)}>
            <Chip
              style={[styles.shinyChip, isShiny && styles.shinyChipActive]}
              icon="star"
              textStyle={{ color: isShiny ? '#FFD700' : '#B3B3B3' }}
            >
              Shiny
            </Chip>
          </TouchableOpacity>
        </View>

        {/* Formas alternativas */}
        <View style={styles.formsRow}>
          <Chip
            selected={!selectedForm || selectedForm.name === data.baseForm.name}
            onPress={() => setSelectedForm(data.baseForm)}
            style={styles.formChip}
          >
            Normal
          </Chip>
          {data.forms?.map((form) => (
            <Chip
              key={form.name}
              selected={selectedForm.name === form.name}
              onPress={() => setSelectedForm(form)}
              style={styles.formChip}
            >
              {form.name}
            </Chip>
          ))}
        </View>

        {/* Nome e tipos */}
        <Text style={styles.name}>{data.name}</Text>
        <View style={styles.typesRow}>
          {data.types.map((type) => (
            <Chip key={type} style={styles.typeChip}>{type}</Chip>
          ))}
        </View>

        {/* Stats */}
        <Surface style={styles.statsBox}>
          <Text style={styles.statsTitle}>Stats</Text>
          {Object.entries(selectedForm.stats).map(([stat, value]) => (
            <View key={stat} style={styles.statRow}>
              <Text style={styles.statName}>{stat.toUpperCase()}</Text>
              <Text style={styles.statValue}>{value}</Text>
            </View>
          ))}
        </Surface>

        {/* Movimentos */}
        <Surface style={styles.movesBox}>
          <Text style={styles.movesTitle}>Movimentos</Text>
          {data.moves.map((move, idx) => (
            <View key={idx} style={styles.moveRow}>
              <Text style={styles.moveName}>{move.name}</Text>
              <Text style={styles.moveMethod}>{move.method}{move.level ? ` (Nv. ${move.level})` : ''}</Text>
            </View>
          ))}
        </Surface>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { backgroundColor: '#121212' },
  container: { padding: 16, alignItems: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  spriteContainer: { alignItems: 'center', marginBottom: 16 },
  sprite: { width: 160, height: 160 },
  shinyChip: { marginTop: 8, backgroundColor: '#232323' },
  shinyChipActive: { backgroundColor: '#FFD70022' },
  formsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  formChip: { marginHorizontal: 4, backgroundColor: '#232323' },
  name: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginVertical: 8 },
  typesRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeChip: { backgroundColor: '#3B4CCA', color: '#fff', marginHorizontal: 2 },
  statsBox: { width: '100%', backgroundColor: '#232323', borderRadius: 12, padding: 12, marginBottom: 16 },
  statsTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  statName: { color: '#B3B3B3' },
  statValue: { color: '#fff', fontWeight: 'bold' },
  movesBox: { width: '100%', backgroundColor: '#232323', borderRadius: 12, padding: 12, marginBottom: 16 },
  movesTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  moveRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  moveName: { color: '#fff' },
  moveMethod: { color: '#B3B3B3', fontStyle: 'italic' },
});