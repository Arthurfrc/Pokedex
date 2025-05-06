import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import PrimaryButton from '../components/PrimaryButton';

type PokedexNavProp = NativeStackNavigationProp<RootStackParamList, 'Pokedex'>;
interface Props {
  navigation: PokedexNavProp;
}

export default function PokedexScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <PrimaryButton
                title="Pokémons"
                onPress={() => navigation.navigate('PokemonList')}
            />
            <PrimaryButton
                title="Itens"
                onPress={() => navigation.navigate('Items')}
            />
            <PrimaryButton
                title="Habilidades"
                onPress={() => navigation.navigate('Abilities')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    }
});