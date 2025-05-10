import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';
import PrimaryButton from '@/components/PrimaryButton';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
    navigation: HomeNavProp;
}

export default function HomeScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <PrimaryButton
                title="Criar Time Teste"
                onPress={() => navigation.navigate('TeamBuilder')}
            />
            <PrimaryButton
                title="Pokedex"
                onPress={() => navigation.navigate('Pokedex')}
                backgroundColor="#E53935"
                textColor="#fff"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    }
});