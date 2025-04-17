import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface MarketData {
  crypto: Array<{
    symbol: string;
    price: number;
    change: number;
    volume: number;
    chart: number[];
  }>;
  forex: Array<{
    pair: string;
    rate: number;
    change: number;
    volume: number;
    chart: number[];
  }>;
  stocks: Array<{
    symbol: string;
    price: number;
    change: number;
    volume: number;
    chart: number[];
  }>;
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/market/analysis');
        setMarketData(response.data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Market Overview
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Real-time market data and analysis
        </Text>
      </View>

      {loading ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text>Loading market data...</Text>
          </Card.Content>
        </Card>
      ) : marketData && (
        <>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge">Cryptocurrencies</Text>
              {marketData.crypto.map((crypto) => (
                <View key={crypto.symbol} style={styles.marketItem}>
                  <Text variant="bodyMedium">{crypto.symbol}</Text>
                  <Text variant="bodyMedium">${crypto.price.toFixed(2)}</Text>
                  <Text variant="bodyMedium" style={crypto.change >= 0 ? styles.positive : styles.negative}>
                    {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge">Forex</Text>
              {marketData.forex.map((forex) => (
                <View key={forex.pair} style={styles.marketItem}>
                  <Text variant="bodyMedium">{forex.pair}</Text>
                  <Text variant="bodyMedium">{forex.rate.toFixed(4)}</Text>
                  <Text variant="bodyMedium" style={forex.change >= 0 ? styles.positive : styles.negative}>
                    {forex.change >= 0 ? '+' : ''}{forex.change.toFixed(2)}%
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge">Stock Indices</Text>
              {marketData.stocks.map((stock) => (
                <View key={stock.symbol} style={styles.marketItem}>
                  <Text variant="bodyMedium">{stock.symbol}</Text>
                  <Text variant="bodyMedium">${stock.price.toFixed(2)}</Text>
                  <Text variant="bodyMedium" style={stock.change >= 0 ? styles.positive : styles.negative}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </>
      )}

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
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
});

export default HomeScreen; 