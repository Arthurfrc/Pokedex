import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function LoadingSpinner() {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 