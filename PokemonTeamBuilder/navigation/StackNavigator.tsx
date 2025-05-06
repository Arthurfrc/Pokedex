import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/screens/HomeScreen';
import TeamBuilderScreen from '@/screens/TeamBuilderScreen';
import MovesScreen from '@/screens/MovesScreen';
import MoveDetailsScreen from '@/screens/MoveDetailScreen';
import TypeCoverageScreen from '@/screens/TypeCoverageScreen';
import PokemonDetailsScreen from '@/screens/PokemonDetailsScreen';
import { Move } from '@/types/Move';
import { Pokemon } from '@/types/Pokemon';

export type RootStackParamList = {
    Home: undefined;
    TeamBuilder: undefined;
    Moves: undefined;
    MoveDetails: { move: Move };
    TypeCoverage: undefined;
    PokemonDetails: { pokemon: Pokemon };
};

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#121212',
                    shadowColor: 'transparent',
                    elevation: 0,
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                cardStyle: { backgroundColor: '#121212' },
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'PokéTeam Builder' }}
            />
            <Stack.Screen
                name="TeamBuilder"
                component={TeamBuilderScreen}
                options={{ title: 'Montar Time' }}
            />
            <Stack.Screen
                name="Moves"
                component={MovesScreen}
                options={{ title: 'Pokédex' }}
            />
            <Stack.Screen
                name="MoveDetails"
                component={MoveDetailsScreen}
                options={({ route }) => ({ title: route.params.move.name })}
            />
            <Stack.Screen
                name="TypeCoverage"
                component={TypeCoverageScreen}
                options={{ title: 'Cobertura de Tipos' }}
            />
            <Stack.Screen
                name="PokemonDetails"
                component={PokemonDetailsScreen}
                options={({ route }) => ({ title: route.params.pokemon.name })}
            />
        </Stack.Navigator>
    );
};

export default StackNavigator;