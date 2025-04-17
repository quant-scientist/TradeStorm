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
        # Get top cryptocurrencies
        crypto_symbols = ['BTC', 'ETH', 'BNB', 'ADA', 'DOGE']
        market_data = []
        
        for symbol in crypto_symbols:
            data, _ = ts.get_digital_currency_daily(symbol=symbol, market='USD')
            latest_data = list(data.values())[0]
            historical_data = list(data.values())[:24]  # Last 24 hours
            
            chart_data = [float(d['4a. close (USD)']) for d in historical_data]
            current_price = float(latest_data['4a. close (USD)'])
            prev_price = float(list(data.values())[1]['4a. close (USD)'])
            price_change = ((current_price - prev_price) / prev_price) * 100
            
            market_data.append({
                'symbol': symbol,
                'price': current_price,
                'change': price_change,
                'volume': float(latest_data['5. volume']),
                'chartData': chart_data
            })
        
        return market_data
    except Exception as e:
        print(f"Error fetching crypto data: {e}")
        return []

def get_forex_rates() -> List[Dict[str, Any]]:
    """Fetch major forex pairs rates."""
    try:
        forex_pairs = ['EUR/USD', 'GBP/USD', 'JPY/USD', 'AUD/USD']
        market_data = []
        
        for pair in forex_pairs:
            data, _ = fx.get_currency_exchange_daily(from_symbol=pair.split('/')[0], 
                                                   to_symbol=pair.split('/')[1])
            latest_data = list(data.values())[0]
            historical_data = list(data.values())[:24]
            
            chart_data = [float(d['4. close']) for d in historical_data]
            current_price = float(latest_data['4. close'])
            prev_price = float(list(data.values())[1]['4. close'])
            price_change = ((current_price - prev_price) / prev_price) * 100
            
            market_data.append({
                'symbol': pair.replace('/', ''),
                'price': current_price,
                'change': price_change,
                'volume': float(latest_data['5. volume']),
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
            'SPX': '^GSPC',  # S&P 500
            'NDX': '^NDX',   # NASDAQ
            'DJI': '^DJI'    # Dow Jones
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