import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';
import theme from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EvolveItems'>;

export default function EvolveItemsScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Evolve Items</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
});