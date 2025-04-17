from alpha_vantage.timeseries import TimeSeries
from alpha_vantage.foreignexchange import ForeignExchange
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import pandas as pd
import numpy as np
from typing import List, Dict, Any
import time

load_dotenv()

# Initialize Alpha Vantage clients
ts = TimeSeries(key=os.getenv('ALPHA_VANTAGE_API_KEY'))
fx = ForeignExchange(key=os.getenv('ALPHA_VANTAGE_API_KEY'))

# Cache for API responses
cache = {}
CACHE_DURATION = 300  # 5 minutes

def get_cached_data(key: str, fetch_func):
    """Get data from cache or fetch new data if cache is expired."""
    # For testing, always return mock data
    return get_mock_crypto_data() if 'crypto' in key else \
           get_mock_forex_data() if 'forex' in key else \
           get_mock_stock_data()

def get_mock_crypto_data() -> List[Dict[str, Any]]:
    """Return mock cryptocurrency data for testing."""
    return [
        {
            'symbol': 'BTC',
            'price': 50000 + np.random.uniform(-1000, 1000),
            'change': np.random.uniform(-5, 5),
            'volume': np.random.uniform(1000000, 5000000),
            'chartData': [50000 + np.random.uniform(-1000, 1000) for _ in range(24)]
        },
        {
            'symbol': 'ETH',
            'price': 3000 + np.random.uniform(-100, 100),
            'change': np.random.uniform(-5, 5),
            'volume': np.random.uniform(500000, 2000000),
            'chartData': [3000 + np.random.uniform(-100, 100) for _ in range(24)]
        }
    ]

def get_mock_forex_data() -> List[Dict[str, Any]]:
    """Return mock forex data for testing."""
    return [
        {
            'symbol': 'EURUSD',
            'price': 1.08 + np.random.uniform(-0.01, 0.01),
            'change': np.random.uniform(-1, 1),
            'volume': 0,
            'chartData': [1.08 + np.random.uniform(-0.01, 0.01) for _ in range(24)]
        },
        {
            'symbol': 'GBPUSD',
            'price': 1.25 + np.random.uniform(-0.01, 0.01),
            'change': np.random.uniform(-1, 1),
            'volume': 0,
            'chartData': [1.25 + np.random.uniform(-0.01, 0.01) for _ in range(24)]
        }
    ]

def get_mock_stock_data() -> List[Dict[str, Any]]:
    """Return mock stock data for testing."""
    return [
        {
            'symbol': 'SPX',
            'price': 5000 + np.random.uniform(-50, 50),
            'change': np.random.uniform(-2, 2),
            'volume': np.random.uniform(1000000, 3000000),
            'chartData': [5000 + np.random.uniform(-50, 50) for _ in range(24)]
        },
        {
            'symbol': 'NDX',
            'price': 17000 + np.random.uniform(-100, 100),
            'change': np.random.uniform(-2, 2),
            'volume': np.random.uniform(500000, 1500000),
            'chartData': [17000 + np.random.uniform(-100, 100) for _ in range(24)]
        }
    ]

def get_crypto_prices() -> List[Dict[str, Any]]:
    """Fetch top cryptocurrency prices and their changes."""
    def fetch_crypto():
        crypto_symbols = {
            'BTC': 'BTCUSD',
            'ETH': 'ETHUSD',
            'BNB': 'BNBUSD',
            'ADA': 'ADAUSD',
            'DOGE': 'DOGEUSD'
        }
        market_data = []
        
        for symbol, av_symbol in crypto_symbols.items():
            data, _ = ts.get_daily(symbol=av_symbol)
            latest_data = list(data.values())[0]
            historical_data = list(data.values())[:24]
            
            chart_data = [float(d['4. close']) for d in historical_data]
            current_price = float(latest_data['4. close'])
            prev_price = float(list(data.values())[1]['4. close'])
            price_change = ((current_price - prev_price) / prev_price) * 100
            
            volume = 0
            if '5. volume' in latest_data:
                volume = float(latest_data['5. volume'])
            elif '6. volume' in latest_data:
                volume = float(latest_data['6. volume'])
            
            market_data.append({
                'symbol': symbol,
                'price': current_price,
                'change': price_change,
                'volume': volume,
                'chartData': chart_data
            })
        
        return market_data
    
    return get_cached_data('crypto', fetch_crypto)

def get_forex_rates() -> List[Dict[str, Any]]:
    """Fetch major forex pairs rates."""
    def fetch_forex():
        forex_pairs = {
            'EURUSD': ('EUR', 'USD'),
            'GBPUSD': ('GBP', 'USD'),
            'JPYUSD': ('JPY', 'USD'),
            'AUDUSD': ('AUD', 'USD')
        }
        market_data = []
        
        for symbol, (from_currency, to_currency) in forex_pairs.items():
            data, _ = fx.get_currency_exchange_daily(from_symbol=from_currency, 
                                                   to_symbol=to_currency)
            latest_data = list(data.values())[0]
            historical_data = list(data.values())[:24]
            
            chart_data = [float(d['4. close']) for d in historical_data]
            current_price = float(latest_data['4. close'])
            prev_price = float(list(data.values())[1]['4. close'])
            price_change = ((current_price - prev_price) / prev_price) * 100
            
            market_data.append({
                'symbol': symbol,
                'price': current_price,
                'change': price_change,
                'volume': 0,
                'chartData': chart_data
            })
        
        return market_data
    
    return get_cached_data('forex', fetch_forex)

def get_stock_indices() -> List[Dict[str, Any]]:
    """Fetch major stock indices."""
    def fetch_stocks():
        indices = {
            'SPX': 'SPY',
            'NDX': 'QQQ',
            'DJI': 'DIA'
        }
        
        market_data = []
        for symbol, av_symbol in indices.items():
            data, _ = ts.get_daily(symbol=av_symbol)
            latest_data = list(data.values())[0]
            historical_data = list(data.values())[:24]
            
            chart_data = [float(d['4. close']) for d in historical_data]
            current_price = float(latest_data['4. close'])
            prev_price = float(list(data.values())[1]['4. close'])
            price_change = ((current_price - prev_price) / prev_price) * 100
            
            volume = 0
            if '5. volume' in latest_data:
                volume = float(latest_data['5. volume'])
            elif '6. volume' in latest_data:
                volume = float(latest_data['6. volume'])
            
            market_data.append({
                'symbol': symbol,
                'price': current_price,
                'change': price_change,
                'volume': volume,
                'chartData': chart_data
            })
        
        return market_data
    
    return get_cached_data('stocks', fetch_stocks)

def get_market_analysis() -> Dict[str, List[Dict[str, Any]]]:
    """Get comprehensive market analysis data."""
    return {
        'crypto': get_crypto_prices(),
        'forex': get_forex_rates(),
        'stocks': get_stock_indices(),
        'all': get_crypto_prices() + get_forex_rates() + get_stock_indices()
    } 