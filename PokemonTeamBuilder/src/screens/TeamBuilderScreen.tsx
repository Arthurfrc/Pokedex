import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TeamBuilderScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Team Builder</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    }
});