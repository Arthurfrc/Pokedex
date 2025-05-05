import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { Pokemon } from '../types/Pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  compact?: boolean;
}

export default function PokemonCard({ pokemon, compact }: PokemonCardProps) {
  const theme = useTheme();
  const spriteUri = pokemon.sprite || pokemon.sprites.default;

  return (
    <Surface style={[styles.card, compact && styles.cardCompact]} elevation={2}>
      <Image
        source={{ uri: spriteUri }}
        style={[styles.image, compact && styles.imageCompact]}
        resizeMode="contain"
      />
      {!compact && (
        <Text style={[styles.name, { color: theme.colors.onSurface }]}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
    margin: 4,
  },
  cardCompact: {
    padding: 8,
    margin: 2,
  },
  image: {
    width: 80,
    height: 80,
  },
  imageCompact: {
    width: 48,
    height: 48,
  },
  name: {
    marginTop: 8,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 