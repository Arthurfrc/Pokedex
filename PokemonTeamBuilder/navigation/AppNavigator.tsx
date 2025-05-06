import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import DrawerNavigator from './DrawerNavigator';
import { TeamProvider } from '@/context/TeamContext';
import { Provider as PaperProvider } from 'react-native-paper';
import theme from '@/theme';

const AppNavigator = () => {
    return (
        <PaperProvider theme={theme}>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />
            <TeamProvider>
                <DrawerNavigator />
            </TeamProvider>
        </PaperProvider>
    );
};

export default AppNavigator;