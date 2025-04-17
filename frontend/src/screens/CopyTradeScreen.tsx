import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, List, ActivityIndicator, Switch } from 'react-native-paper';
import axios from 'axios';

interface Trader {
  id: string;
  name: string;
  performance: number;
  trades: number;
  winRate: number;
  isFollowing: boolean;
}

const CopyTradeScreen = () => {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTraders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/copy-trade/traders');
      setTraders(response.data);
    } catch (error) {
      console.error('Error fetching traders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTraders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTraders();
  };

  const toggleFollow = async (traderId: string) => {
    try {
      await axios.post('http://localhost:8000/copy-trade/toggle', {
        traderId: traderId
      });
      setTraders((prevTraders) =>
        prevTraders.map((trader) =>
          trader.id === traderId
            ? { ...trader, isFollowing: !trader.isFollowing }
            : trader
        )
      );
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Copy Trading
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Follow successful traders automatically
        </Text>
      </View>

      {traders.map((trader) => (
        <Card key={trader.id} style={styles.card}>
          <Card.Content>
            <View style={styles.traderHeader}>
              <Text variant="titleLarge">{trader.name}</Text>
              <Switch
                value={trader.isFollowing}
                onValueChange={() => toggleFollow(trader.id)}
                color="#6200ee"
              />
            </View>

            <List.Item
              title="Performance"
              description={`${trader.performance >= 0 ? '+' : ''}${trader.performance.toFixed(2)}%`}
              left={(props) => <List.Icon {...props} icon="chart-line" />}
              right={() => (
                <Text
                  style={[
                    styles.performanceText,
                    {
                      color: trader.performance >= 0 ? '#4CAF50' : '#F44336',
                    },
                  ]}
                >
                  {trader.performance >= 0 ? '+' : ''}
                  {trader.performance.toFixed(2)}%
                </Text>
              )}
            />

            <List.Item
              title="Total Trades"
              description={trader.trades.toString()}
              left={(props) => <List.Icon {...props} icon="swap-horizontal" />}
            />

            <List.Item
              title="Win Rate"
              description={`${(trader.winRate * 100).toFixed(1)}%`}
              left={(props) => <List.Icon {...props} icon="trophy" />}
            />

            <Button
              mode="contained"
              onPress={() => {}}
              style={styles.detailsButton}
            >
              View Details
            </Button>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
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
  traderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceText: {
    fontWeight: 'bold',
  },
  detailsButton: {
    marginTop: 16,
  },
});

export default CopyTradeScreen; 