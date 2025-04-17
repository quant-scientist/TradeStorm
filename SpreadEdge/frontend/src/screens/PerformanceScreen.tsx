import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Animated } from 'react-native';
import { Text, Card, List, ActivityIndicator, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface Strategy {
  id: string;
  name: string;
  description: string;
  performance: {
    total_return: number;
    win_rate: number;
    trades: number;
    sharpe_ratio: number;
  };
  last_updated: string;
}

const PerformanceScreen = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const fadeAnim = new Animated.Value(1);
  const navigation = useNavigation();

  const fetchStrategies = async () => {
    try {
      // TODO: Replace with actual API call
      const mockStrategies: Strategy[] = [
        {
          id: '1',
          name: 'Momentum Trading',
          description: 'Capitalizes on market momentum with quick entries and exits',
          performance: {
            total_return: 15.2,
            win_rate: 68.5,
            trades: 124,
            sharpe_ratio: 1.8,
          },
          last_updated: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Mean Reversion',
          description: 'Trades based on price returning to historical averages',
          performance: {
            total_return: 12.8,
            win_rate: 62.3,
            trades: 98,
            sharpe_ratio: 1.5,
          },
          last_updated: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Breakout Trading',
          description: 'Identifies and trades breakouts from key price levels',
          performance: {
            total_return: 18.5,
            win_rate: 71.2,
            trades: 156,
            sharpe_ratio: 2.1,
          },
          last_updated: new Date().toISOString(),
        },
      ];
      setStrategies(mockStrategies);
    } catch (error) {
      console.error('Error fetching strategies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStrategies();
  };

  const handleStrategyPress = (strategyId: string) => {
    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedStrategy(strategyId);
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleBackPress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedStrategy(null);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
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
          Trading Strategies
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Performance metrics and analysis
        </Text>
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        {selectedStrategy ? (
          <Card style={styles.strategyDetailCard}>
            <Card.Content>
              <Button
                icon="arrow-left"
                mode="text"
                onPress={handleBackPress}
                style={styles.backButton}
              >
                Back to Strategies
              </Button>
              
              {strategies
                .filter((s) => s.id === selectedStrategy)
                .map((strategy) => (
                  <View key={strategy.id}>
                    <Text variant="headlineSmall" style={styles.strategyName}>
                      {strategy.name}
                    </Text>
                    <Text variant="bodyLarge" style={styles.strategyDescription}>
                      {strategy.description}
                    </Text>
                    
                    <View style={styles.metricsContainer}>
                      <View style={styles.metricCard}>
                        <Text variant="titleMedium">Total Return</Text>
                        <Text
                          variant="headlineMedium"
                          style={[
                            styles.metricValue,
                            {
                              color:
                                strategy.performance.total_return >= 0
                                  ? '#4CAF50'
                                  : '#F44336',
                            },
                          ]}
                        >
                          {strategy.performance.total_return >= 0 ? '+' : ''}
                          {strategy.performance.total_return.toFixed(1)}%
                        </Text>
                      </View>
                      
                      <View style={styles.metricCard}>
                        <Text variant="titleMedium">Win Rate</Text>
                        <Text variant="headlineMedium" style={styles.metricValue}>
                          {strategy.performance.win_rate.toFixed(1)}%
                        </Text>
                      </View>
                      
                      <View style={styles.metricCard}>
                        <Text variant="titleMedium">Trades</Text>
                        <Text variant="headlineMedium" style={styles.metricValue}>
                          {strategy.performance.trades}
                        </Text>
                      </View>
                      
                      <View style={styles.metricCard}>
                        <Text variant="titleMedium">Sharpe Ratio</Text>
                        <Text variant="headlineMedium" style={styles.metricValue}>
                          {strategy.performance.sharpe_ratio.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    
                    <Button
                      mode="contained"
                      onPress={() => {
                        // TODO: Implement strategy activation
                        console.log('Activating strategy:', strategy.id);
                      }}
                      style={styles.activateButton}
                    >
                      Activate Strategy
                    </Button>
                  </View>
                ))}
            </Card.Content>
          </Card>
        ) : (
          strategies.map((strategy) => (
            <Card
              key={strategy.id}
              style={styles.strategyCard}
              onPress={() => handleStrategyPress(strategy.id)}
            >
              <Card.Content>
                <View style={styles.strategyHeader}>
                  <Text variant="titleLarge">{strategy.name}</Text>
                  <Text
                    variant="bodyLarge"
                    style={[
                      styles.returnValue,
                      {
                        color:
                          strategy.performance.total_return >= 0
                            ? '#4CAF50'
                            : '#F44336',
                      },
                    ]}
                  >
                    {strategy.performance.total_return >= 0 ? '+' : ''}
                    {strategy.performance.total_return.toFixed(1)}%
                  </Text>
                </View>
                <Text variant="bodyMedium" style={styles.description}>
                  {strategy.description}
                </Text>
                <View style={styles.quickStats}>
                  <Text variant="bodySmall">
                    Win Rate: {strategy.performance.win_rate.toFixed(1)}%
                  </Text>
                  <Text variant="bodySmall">
                    Trades: {strategy.performance.trades}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </Animated.View>
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
  strategyCard: {
    margin: 16,
    elevation: 4,
  },
  strategyDetailCard: {
    margin: 16,
    elevation: 4,
  },
  strategyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  returnValue: {
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 8,
    color: '#666',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  backButton: {
    marginBottom: 16,
  },
  strategyName: {
    marginBottom: 8,
  },
  strategyDescription: {
    marginBottom: 16,
    color: '#666',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  metricValue: {
    marginTop: 8,
  },
  activateButton: {
    marginTop: 16,
  },
});

export default PerformanceScreen; 