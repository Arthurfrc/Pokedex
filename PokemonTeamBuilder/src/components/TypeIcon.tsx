import React from 'react';
import { View, StyleSheet } from 'react-native';

type PokemonType = 
  | 'Water' | 'Steel' | 'Rock' | 'Psychic' | 'Poison' | 'Normal'
  | 'Ice' | 'Ground' | 'Grass' | 'Ghost' | 'Flying' | 'Fire'
  | 'Fairy' | 'Fighting' | 'Electric' | 'Dragon' | 'Dark' | 'Bug';

interface TypeIconProps {
  type: PokemonType;
  size?: number;
}

const typeIcons = {
  Water: require('../../assets/pokemontypes/Water.svg'),
  Steel: require('../../assets/pokemontypes/Steel.svg'),
  Rock: require('../../assets/pokemontypes/Rock.svg'),
  Psychic: require('../../assets/pokemontypes/Psychic.svg'),
  Poison: require('../../assets/pokemontypes/Poison.svg'),
  Normal: require('../../assets/pokemontypes/Normal.svg'),
  Ice: require('../../assets/pokemontypes/Ice.svg'),
  Ground: require('../../assets/pokemontypes/Ground.svg'),
  Grass: require('../../assets/pokemontypes/Grass.svg'),
  Ghost: require('../../assets/pokemontypes/Ghost.svg'),
  Flying: require('../../assets/pokemontypes/Flying.svg'),
  Fire: require('../../assets/pokemontypes/Fire.svg'),
  Fairy: require('../../assets/pokemontypes/Fairy.svg'),
  Fighting: require('../../assets/pokemontypes/Fighting.svg'),
  Electric: require('../../assets/pokemontypes/Electric.svg'),
  Dragon: require('../../assets/pokemontypes/Dragon.svg'),
  Dark: require('../../assets/pokemontypes/Dark.svg'),
  Bug: require('../../assets/pokemontypes/Bug.svg'),
} as const;

export const TypeIcon: React.FC<TypeIconProps> = ({ type, size = 24 }) => {
  const TypeSvg = typeIcons[type]?.default;

  if (!TypeSvg) {
    console.warn(`Ícone não encontrado para o tipo: ${type}`);
    return null;
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <TypeSvg width={size} height={size} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 