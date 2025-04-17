from binance.client import Client
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import pandas as pd
import numpy as np
from typing import List, Dict, Any

load_dotenv()

# Initialize Binance client
client = Client()

def get_crypto_prices() -> List[Dict[str, Any]]:
    """Fetch top cryptocurrency prices and their 24h changes."""
    try:
        # Get top 10 cryptocurrencies by volume
        tickers = client.get_ticker()
        crypto_tickers = [t for t in tickers if t['symbol'].endswith('USDT')]
        sorted_tickers = sorted(crypto_tickers, key=lambda x: float(x['volume']), reverse=True)[:10]
        
        market_data = []
        for ticker in sorted_tickers:
            # Get historical data for chart
            klines = client.get_historical_klines(
                ticker['symbol'],
                Client.KLINE_INTERVAL_1HOUR,
                str(datetime.now() - timedelta(days=1))
            )
            
            chart_data = [float(k[4]) for k in klines]  # Closing prices
            
            market_data.append({
                'symbol': ticker['symbol'].replace('USDT', ''),
                'price': float(ticker['lastPrice']),
                'change': float(ticker['priceChangePercent']),
                'volume': float(ticker['volume']),
                'chartData': chart_data
            })
        
        return market_data
    except Exception as e:
        print(f"Error fetching crypto data: {e}")
        return []

def get_forex_rates() -> List[Dict[str, Any]]:
    """Fetch major forex pairs rates."""
    try:
        # Using Binance's USDT pairs as a proxy for forex rates
        forex_pairs = ['EURUSDT', 'GBPUSDT', 'JPYUSDT', 'AUDUSDT']
        market_data = []
        
        for pair in forex_pairs:
            ticker = client.get_ticker(symbol=pair)
            klines = client.get_historical_klines(
                pair,
                Client.KLINE_INTERVAL_1HOUR,
                str(datetime.now() - timedelta(days=1))
            )
            
            chart_data = [float(k[4]) for k in klines]
            
            market_data.append({
                'symbol': pair.replace('USDT', ''),
                'price': float(ticker['lastPrice']),
                'change': float(ticker['priceChangePercent']),
                'volume': float(ticker['volume']),
                'chartData': chart_data
            })
        
        return market_data
    except Exception as e:
        print(f"Error fetching forex data: {e}")
        return []

def get_stock_indices() -> List[Dict[str, Any]]:
    """Fetch major stock indices using crypto pairs as proxies."""
    try:
        # Using crypto pairs as proxies for stock indices
        indices = {
            'SPX': 'BTCUSDT',  # Using BTC as proxy for S&P 500
            'NDX': 'ETHUSDT',  # Using ETH as proxy for NASDAQ
            'DJI': 'BNBUSDT'   # Using BNB as proxy for Dow Jones
        }
        
        market_data = []
        for index, proxy in indices.items():
            ticker = client.get_ticker(symbol=proxy)
            klines = client.get_historical_klines(
                proxy,
                Client.KLINE_INTERVAL_1HOUR,
                str(datetime.now() - timedelta(days=1))
            )
            
            chart_data = [float(k[4]) for k in klines]
            
            market_data.append({
                'symbol': index,
                'price': float(ticker['lastPrice']),
                'change': float(ticker['priceChangePercent']),
                'volume': float(ticker['volume']),
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