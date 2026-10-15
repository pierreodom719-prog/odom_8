import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function CustomTitle({ titleText }) {
  return (
    <Text style={styles.titleText}>{titleText}</Text>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});