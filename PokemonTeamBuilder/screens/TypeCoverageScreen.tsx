import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Chip, Surface } from 'react-native-paper';
import { useTeam } from '@/context/TeamContext';

const allTypes = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function TypeCoverageScreen() {
  const { team } = useTeam();

  // Coleta todos os tipos do time
  const coveredTypes = Array.from(
    new Set(team.flatMap(member => member.pokemon.types))
  );
  const missingTypes = allTypes.filter(type => !coveredTypes.includes(type));

  return (
    <View style={styles.container}>
      <Surface style={styles.box}>
        <Text style={styles.title}>Tipos Cobertos</Text>
        <FlatList
          data={coveredTypes}
          keyExtractor={item => item}
          numColumns={3}
          renderItem={({ item }) => (
            <Chip style={styles.typeChip}>{item}</Chip>
          )}
        />
      </Surface>
      <Surface style={styles.box}>
        <Text style={styles.title}>Tipos Faltantes</Text>
        <FlatList
          data={missingTypes}
          keyExtractor={item => item}
          numColumns={3}
          renderItem={({ item }) => (
            <Chip style={[styles.typeChip, styles.missing]}>{item}</Chip>
          )}
        />
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#121212' },
  box: { backgroundColor: '#232323', borderRadius: 12, padding: 12, marginBottom: 16 },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  typeChip: { margin: 4, backgroundColor: '#3B4CCA', color: '#fff' },
  missing: { backgroundColor: '#444' },
});