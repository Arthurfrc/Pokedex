import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';
import PrimaryButton from '@/components/PrimaryButton';

type ItemsNavProp = NativeStackNavigationProp<RootStackParamList, 'Items'>;
interface Props {
  navigation: ItemsNavProp;
}

export default function ItemsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <PrimaryButton
        title="Mega Stones"
        onPress={() => navigation.navigate('MegaStones')}
      ></PrimaryButton>
      <PrimaryButton
        title="Evolve Items"
        onPress={() => navigation.navigate('EvolveItems')}
      ></PrimaryButton>
      <PrimaryButton
        title="TMs & HMs"
        onPress={() => navigation.navigate('TMsHMs')}
      ></PrimaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});