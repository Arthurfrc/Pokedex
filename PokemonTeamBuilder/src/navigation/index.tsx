import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeScreen from "@/screens/HomeScreen";
import TeamBuilderScreen from "@/screens/TeamBuilderScreen";
import PokedexScreen from "@/screens/PokedexScreen";
import PokemonListScreen from "@/screens/PokemonListScreen";
import ItemsScreen from "@/screens/ItemsScreen";
import AbilitiesScreen from "@/screens/AbilitiesScreen";
import AbilityDetailScreen from "@/screens/AbilityDetailScreen";
import EvolveItemsScreen from "@/screens/EvolveItemsScreen";
import TMsHMsScreen from "@/screens/TMsHMsScreen";
import MegaStonesScreen from "@/screens/MegaStonesScreen";

import theme from "@/theme";

export type RootStackParamList = {
    Home: undefined;
    TeamBuilder: undefined;
    Pokedex: undefined;
    PokemonList: undefined;
    Items: undefined;
    Abilities: undefined;
    AbilityDetail: { abilityName: string; abilityUrl: string };
    EvolveItems: undefined;
    TMsHMs: undefined;
    MegaStones: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: route.name !== 'Home',
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.white,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="TeamBuilder" component={TeamBuilderScreen} />
            <Stack.Screen name="Pokedex" component={PokedexScreen} />
            <Stack.Screen name="PokemonList" component={PokemonListScreen} />
            <Stack.Screen name="Items" component={ItemsScreen} />
            <Stack.Screen name="Abilities" component={AbilitiesScreen} />
            <Stack.Screen name="AbilityDetail" component={AbilityDetailScreen} />
            <Stack.Screen name="EvolveItems" component={EvolveItemsScreen} />
            <Stack.Screen name="TMsHMs" component={TMsHMsScreen} />
            <Stack.Screen name="MegaStones" component={MegaStonesScreen} />
        </Stack.Navigator >
    )
}