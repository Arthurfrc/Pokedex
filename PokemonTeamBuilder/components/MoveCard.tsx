import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { Move } from '@/types/Move';
import theme from '@/theme';
import Svg, { SvgProps } from 'react-native-svg';

interface MoveCardProps {
    move: Move;
    onPress?: (move: Move) => void;
}

const MoveCard: React.FC<MoveCardProps> = ({ move, onPress }) => {
    const handlePress = () => {
        if (onPress) {
            onPress(move);
        }
    };

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.header}>
                        <Text variant="titleMedium" style={styles.moveName}>
                            {move.name}
                        </Text>
                        <View style={styles.typeContainer}>
                            {/* Exibir ícone do tipo do ataque (ex: pokemontypes/fire.svg) */}
                            <Chip
                                style={[styles.typeChip, { backgroundColor: theme.pokemonColors[move.type] }]}
                                textStyle={styles.chipText}
                            >
                                {move.type.charAt(0).toUpperCase() + move.type.slice(1)}
                            </Chip>
                        </View>
                    </View>

                    <View style={styles.moveDetails}>
                        <View style={styles.detailsColumn}>
                            <View style={styles.detailRow}>
                                {/* Exibir ícone do tipo de ataque (ex: attacktypes/physical.svg) */}
                                <Text style={styles.categoryText}>
                                    {move.category.charAt(0).toUpperCase() + move.category.slice(1)}
                                </Text>
                            </View>

                            {move.power && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.label}>Power:</Text>
                                    <Text style={styles.value}>{move.power}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.detailsColumn}>
                            {move.accuracy && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.label}>Accuracy:</Text>
                                    <Text style={styles.value}>{move.accuracy}%</Text>
                                </View>
                            )}

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>PP:</Text>
                                <Text style={styles.value}>{move.pp}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.description}>
                        <Text style={styles.descriptionText}>{move.description}</Text>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        borderRadius: 12,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    moveName: {
        fontWeight: 'bold',
        flex: 1,
    },
    typeContainer: {
        flexDirection: 'row',
    },
    typeChip: {
        height: 28,
    },
    chipText: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold',
    },
    moveDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    detailsColumn: {
        flex: 1,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    categoryText: {
        fontWeight: '500',
        fontSize: 14,
    },
    label: {
        fontSize: 12,
        opacity: 0.7,
        marginRight: 4,
    },
    value: {
        fontSize: 12,
        fontWeight: '500',
    },
    description: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    descriptionText: {
        fontSize: 12,
        opacity: 0.9,
    },
});

export default MoveCard;