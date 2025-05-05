import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import TeamBuilderScreen from '@/screens/TeamBuilderScreen';
import MovesScreen from '@/screens/MovesScreen';
import TypeCoverageScreen from '@/screens/TypeCoverageScreen';
import { useTheme } from 'react-native-paper';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const theme = useTheme();

    return (
        <NavigationContainer>
            <Drawer.Navigator
                initialRouteName="Main"
                screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    drawerActiveTintColor: theme.colors.primary,
                    drawerInactiveTintColor: theme.colors.onBackground,
                }}
            >
                <Drawer.Screen
                    name="Main"
                    component={StackNavigator}
                    options={{ title: 'Início' }}
                />
                <Drawer.Screen
                    name="TeamBuilder"
                    component={TeamBuilderScreen}
                    options={{ title: 'Montar Time' }}
                />
                <Drawer.Screen
                    name="Pokedex"
                    component={MovesScreen}
                    options={{ title: 'Pokédex' }}
                />
                <Drawer.Screen
                    name="TypeCoverage"
                    component={TypeCoverageScreen}
                    options={{ title: 'Cobertura de Tipos' }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default DrawerNavigator;