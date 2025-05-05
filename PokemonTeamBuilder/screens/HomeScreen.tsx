import React from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useNavigation } from '@react-navigation/native';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation<HomeScreenNavigationProp>();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Text style={styles.title}>PokéTeam Builder</Text>
                    <Image
                        source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.buttonsContainer}>
                    <Button
                        mode="contained"
                        style={[styles.button, { backgroundColor: theme.colors.primary }]}
                        contentStyle={styles.buttonContent}
                        onPress={() => navigation.navigate('TeamBuilder')}
                    >
                        Montar Time
                    </Button>

                    <Button
                        mode="contained"
                        style={[styles.button, { backgroundColor: theme.colors.secondary }]}
                        contentStyle={styles.buttonContent}
                        onPress={() => navigation.navigate('Moves')}
                    >
                        Visualizar Pokédex
                    </Button>
                </View>
            </View>

            <Text style={styles.footer}>
                Versão 1.0.0
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    logo: {
        width: 200,
        height: 200,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonsContainer: {
        width: '100%',
        maxWidth: 300,
    },
    button: {
        marginVertical: 10,
        borderRadius: 12,
        elevation: 4,
    },
    buttonContent: {
        height: 56,
        justifyContent: 'center',
    },
    footer: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 20,
    },
});

export default HomeScreen;