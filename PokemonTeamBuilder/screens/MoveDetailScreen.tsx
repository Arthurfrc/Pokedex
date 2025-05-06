import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Divider, Chip, List } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/StackNavigator';
import theme from '@/theme';

type MoveDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MoveDetails'>;

interface MoveDetailsScreenProps {
    route: MoveDetailsScreenRouteProp;
}

const MoveDetailsScreen: React.FC<MoveDetailsScreenProps> = ({ route }) => {
    const { move } = route.params;

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.moveName}>{move.name}</Text>
                        <Chip
                            style={[styles.typeChip, { backgroundColor: theme.pokemonColors[move.type] }]}
                            textStyle={styles.chipText}
                        >
                            {move.type.charAt(0).toUpperCase() + move.type.slice(1)}
                        </Chip>
                    </View>
                </View>

                <Card.Content>
                    <View style={styles.categoryContainer}>
                        {/* Exibir ícone do tipo de ataque (ex: attacktypes/physical.svg) */}
                        <View style={[styles.categoryBadge, getCategoryStyle(move.category)]}>
                            <Text style={styles.categoryText}>
                                {move.category.charAt(0).toUpperCase() + move.category.slice(1)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statGrid}>
                        {move.power && (
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Poder</Text>
                                <Text style={styles.statValue}>{move.power}</Text>
                            </View>
                        )}

                        {move.accuracy && (
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Precisão</Text>
                                <Text style={styles.statValue}>{move.accuracy}%</Text>
                            </View>
                        )}

                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>PP</Text>
                            <Text style={styles.statValue}>{move.pp}</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Prioridade</Text>
                            <Text style={styles.statValue}>{move.priority > 0 ? `+${move.priority}` : move.priority}</Text>
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>Descrição</Text>
                    <Text style={styles.description}>{move.description}</Text>

                    {move.effect && (
                        <>
                            <Text style={styles.sectionTitle}>Efeito</Text>
                            <Text style={styles.effect}>{move.effect}</Text>

                            {move.effectChance && (
                                <Text style={styles.effectChance}>
                                    Chance de efeito: {move.effectChance}%
                                </Text>
                            )}
                        </>
                    )}

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>Detalhes adicionais</Text>
                    <List.Item
                        title="Alvo"
                        description={getTargetDescription(move.target)}
                        left={props => <List.Icon {...props} icon="target" />}
                    />

                    <List.Item
                        title="Contato"
                        description={move.makesContact ? "Sim" : "Não"}
                        left={props => <List.Icon {...props} icon={move.makesContact ? "hand-back-right" : "hand-back-right-off"} />}
                    />
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const getCategoryStyle = (category: string) => {
    switch (category) {
        case 'physical':
            return styles.physical;
        case 'special':
            return styles.special;
        case 'status':
            return styles.status;
        default:
            return {};
    }
};

const getTargetDescription = (target: string) => {
    const targets: Record<string, string> = {
        'selected-pokemon': 'Um Pokémon selecionado',
        'all-opponents': 'Todos os oponentes',
        'all-adjacent-pokemon': 'Todos os Pokémon adjacentes',
        'user': 'O próprio usuário',
        'all-pokemon': 'Todos os Pokémon em campo',
    };

    return targets[target] || target;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    header: {
        padding: 16,
        backgroundColor: '#1E1E1E',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    moveName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    typeChip: {
        height: 30,
    },
    chipText: {
        color: 'white',
        fontWeight: 'bold',
    },
    categoryContainer: {
        marginTop: 16,
        alignItems: 'flex-start',
    },
    categoryBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    categoryText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    physical: {
        backgroundColor: '#C22E28',
    },
    special: {
        backgroundColor: '#2266CC',
    },
    status: {
        backgroundColor: '#666666',
    },
    statGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
    },
    statItem: {
        width: '50%',
        paddingVertical: 8,
        paddingRight: 16,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
    },
    divider: {
        marginVertical: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
        lineHeight: 22,
    },
    effect: {
        fontSize: 16,
        lineHeight: 22,
    },
    effectChance: {
        fontSize: 14,
        marginTop: 8,
        color: 'rgba(255, 255, 255, 0.7)',
        fontStyle: 'italic',
    },
});

export default MoveDetailsScreen;