import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to SpreadEdge
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your AI-Powered Trading Companion
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Today's Market Overview</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            Get real-time insights and trading signals powered by AI
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Market')}
            style={styles.button}
          >
            View Market
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Active Signals</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            Check out the latest trading signals
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Signals')}
            style={styles.button}
          >
            View Signals
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Copy Trading</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            Follow successful traders automatically
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('CopyTrade')}
            style={styles.button}
          >
            Start Copy Trading
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200ee',
  },
  title: {
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    color: 'white',
    opacity: 0.8,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  cardText: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
  },
});

export default HomeScreen; 