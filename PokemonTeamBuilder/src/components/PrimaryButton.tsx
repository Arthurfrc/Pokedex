import React from "react";
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";

interface PrimaryButtonProps {
    title: string;
    backgroundColor?: string;
    textColor?: string;
    onPress: (e: GestureResponderEvent) => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, backgroundColor = "#E53935", textColor = "#fff" }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }]}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <Text
                style={[styles.text, { color: textColor }]}>{title}</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#E53935",
        padding: 10,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginVertical: 8,
        width: "80%",
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "uppercase",
    }
});

export default PrimaryButton;
