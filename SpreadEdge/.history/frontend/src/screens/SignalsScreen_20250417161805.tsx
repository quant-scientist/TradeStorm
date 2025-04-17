import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, List, ActivityIndicator, Button } from 'react-native-paper';
import axios from 'axios';
import NotificationService from '../services/NotificationService';

interface Signal {
  id: string;
  symbol: string;
  signal_type: string;
  price: number;
  timestamp: string;
  confidence: number;
}

const SignalsScreen = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const notificationService = NotificationService.getInstance();

  const fetchSignals = async () => {
    try {
      const response = await axios.get('http://localhost:8000/signals');
      setSignals(response.data);
    } catch (error) {
      console.error('Error fetching signals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSignals();
  };

  const sendTestNotification = async () => {
    await notificationService.sendLocalNotification(
      'Test Signal',
      'This is a test trading signal notification',
      { type: 'test', timestamp: new Date().toISOString() }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button 
        mode="contained" 
        onPress={sendTestNotification}
        style={styles.testButton}
      >
        Send Test Notification
      </Button>
      
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Trading Signals
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Real-time AI-generated trading opportunities
          </Text>
        </View>

        {signals.map((signal) => (
          <Card key={signal.id} style={styles.card}>
            <Card.Content>
              <View style={styles.signalHeader}>
                <Text variant="titleLarge">{signal.symbol}</Text>
                <Text
                  variant="bodyLarge"
                  style={[
                    styles.signalType,
                    {
                      color:
                        signal.signal_type === 'BUY'
                          ? '#4CAF50'
                          : signal.signal_type === 'SELL'
                          ? '#F44336'
                          : '#FFC107',
                    },
                  ]}
                >
                  {signal.signal_type}
                </Text>
              </View>
              <List.Item
                title="Price"
                description={`$${signal.price.toFixed(2)}`}
                left={(props) => <List.Icon {...props} icon="currency-usd" />}
              />
              <List.Item
                title="Confidence"
                description={`${(signal.confidence * 100).toFixed(1)}%`}
                left={(props) => <List.Icon {...props} icon="chart-line" />}
              />
              <List.Item
                title="Time"
                description={new Date(signal.timestamp).toLocaleString()}
                left={(props) => <List.Icon {...props} icon="clock" />}
              />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  signalType: {
    fontWeight: 'bold',
  },
  testButton: {
    margin: 16,
  },
});

export default SignalsScreen; 