import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';

import theme from '@/theme';

type Ability = {
    name: string;
    url: string;
};

type AbilitiesScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Abilities'>;
};

export default function AbilitiesScreen({ navigation }: AbilitiesScreenProps) {
    const [abilities, setAbilities] = useState<Ability[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        // Pega todas as habilidades (limit alto para garantir que busque todas)
        fetch('https://pokeapi.co/api/v2/ability?limit=10000')
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((json) => {
                // json.results é um array de { name, url }
                const sortedAbilities = json.results.sort((a: Ability, b: Ability) => a.name.localeCompare(b.name));
                setAbilities(sortedAbilities);
            })
            .catch((err) => {
                console.error(err);
                setError('Não foi possível carregar habilidades.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Filtrar habilidades conforme texto de pesquisa
    const filteredAbilities = abilities.filter((a: Ability) =>
        a.name.toLowerCase().includes(searchText.toLowerCase())
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator color={theme.colors.primary} size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar habilidades..."
                placeholderTextColor="#AAAAAA"
                value={searchText}
                onChangeText={setSearchText}
            />
            <FlatList
                data={filteredAbilities}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.row}
                        onPress={() => navigation.navigate('AbilityDetail', { 
                            abilityName: item.name,
                            abilityUrl: item.url 
                        })}
                    >
                        <Text style={styles.itemText}>
                            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                        </Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 16,
    },
    row: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
    },
    itemText: {
        color: theme.colors.text,
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginHorizontal: theme.spacing.md,
    },
    searchInput: {
        height: 40,
        width: '70%',
        alignSelf: 'center',
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.spacing.lg,
        marginVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        color: '#000000',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
    },
});