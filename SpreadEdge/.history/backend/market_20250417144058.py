from alpha_vantage.timeseries import TimeSeries
from alpha_vantage.foreignexchange import ForeignExchange
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import pandas as pd
import numpy as np
from typing import List, Dict, Any

load_dotenv()

# Initialize Alpha Vantage clients
ts = TimeSeries(key=os.getenv('ALPHA_VANTAGE_API_KEY'))
fx = ForeignExchange(key=os.getenv('ALPHA_VANTAGE_API_KEY'))

def get_crypto_prices() -> List[Dict[str, Any]]:
    """Fetch top cryptocurrency prices and their changes."""
    try:
        # Get top cryptocurrencies using their correct symbols
        crypto_symbols = {
            'BTC': 'BTCUSD',  # Bitcoin
            'ETH': 'ETHUSD',  # Ethereum
            'BNB': 'BNBUSD',  # Binance Coin
            'ADA': 'ADAUSD',  # Cardano
            'DOGE': 'DOGEUSD' # Dogecoin
        }
        market_data = []
        
        for symbol, av_symbol in crypto_symbols.items():
            data, _ = ts.get_daily(symbol=av_symbol)
            latest_data = list(data.values())[0]
            historical_data = list(data.values())[:24]  # Last 24 hours
            
            chart_data = [float(d['4. close']) for d in historical_data]
            current_price = float(latest_data['4. close'])
            prev_price = float(list(data.values())[1]['4. close'])
            price_change = ((current_price - prev_price) / prev_price) * 100
            
            market_data.append({
                'symbol': symbol,
                'price': current_price,
                'change': price_change,
                'volume': float(latest_data['6. volume']),
                'chartData': chart_data
            })
        
        return market_data
    except Exception as e:
        print(f"Error fetching crypto data: {e}")
        return []

def get_forex_rates() -> List[Dict[str, Any]]:
    """Fetch major forex pairs rates."""
    try:
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
                'volume': 0,  # Forex doesn't provide volume data
                'chartData': chart_data
            })
        
        return market_data
    except Exception as e:
        print(f"Error fetching forex data: {e}")
        return []

def get_stock_indices() -> List[Dict[str, Any]]:
    """Fetch major stock indices."""
    try:
        indices = {
            'SPX': 'SPY',    # S&P 500 ETF
            'NDX': 'QQQ',    # NASDAQ-100 ETF
            'DJI': 'DIA'     # Dow Jones ETF
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
            
            market_data.append({
                'symbol': symbol,
                'price': current_price,
                'change': price_change,
                'volume': float(latest_data['6. volume']),
                'chartData': chart_data
            })
        
        return market_data
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        return []

def get_market_analysis() -> Dict[str, List[Dict[str, Any]]]:
    """Get comprehensive market analysis data."""
    return {
        'crypto': get_crypto_prices(),
        'forex': get_forex_rates(),
        'stocks': get_stock_indices(),
        'all': get_crypto_prices() + get_forex_rates() + get_stock_indices()
    } 