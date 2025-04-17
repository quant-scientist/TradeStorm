import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import axios from 'axios';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  chartData: number[];
}

const MarketScreen = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('all');

  const fetchMarketData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/market/analysis');
      setMarketData(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMarketData();
  };

  const filteredData = marketData.filter((item) => {
    if (selectedAsset === 'all') return true;
    if (selectedAsset === 'forex') return item.symbol.includes('/');
    if (selectedAsset === 'stocks') return !item.symbol.includes('/') && !item.symbol.includes('-');
    if (selectedAsset === 'crypto') return item.symbol.includes('-');
    return true;
  });

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
          Market Overview
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Real-time market data and analysis
        </Text>
      </View>

      <SegmentedButtons
        value={selectedAsset}
        onValueChange={setSelectedAsset}
        buttons={[
          { value: 'all', label: 'All' },
          { value: 'forex', label: 'Forex' },
          { value: 'stocks', label: 'Stocks' },
          { value: 'crypto', label: 'Crypto' },
        ]}
        style={styles.segmentedButtons}
      />

      {filteredData.map((item) => (
        <Card key={item.symbol} style={styles.card}>
          <Card.Content>
            <View style={styles.marketHeader}>
              <Text variant="titleLarge">{item.symbol}</Text>
              <Text
                variant="bodyLarge"
                style={[
                  styles.priceChange,
                  { color: item.change >= 0 ? '#4CAF50' : '#F44336' },
                ]}
              >
                {item.change >= 0 ? '+' : ''}
                {item.change.toFixed(2)}%
              </Text>
            </View>

            <Text variant="headlineMedium" style={styles.price}>
              ${item.price.toFixed(2)}
            </Text>

            <LineChart
              data={{
                labels: [],
                datasets: [
                  {
                    data: item.chartData,
                  },
                ],
              }}
              width={Dimensions.get('window').width - 64}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.chart}
            />

            <View style={styles.volumeContainer}>
              <Text variant="bodyMedium">Volume:</Text>
              <Text variant="bodyMedium" style={styles.volume}>
                {item.volume.toLocaleString()}
              </Text>
            </View>
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
  segmentedButtons: {
    margin: 16,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceChange: {
    fontWeight: 'bold',
  },
  price: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  volumeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  volume: {
    fontWeight: 'bold',
  },
});

export default MarketScreen; 