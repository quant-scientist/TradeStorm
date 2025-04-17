from typing import List
import random
from datetime import datetime, timedelta
import numpy as np
from market import get_market_analysis

class TradingSignal:
    def __init__(self, symbol: str, signal_type: str, price: float, confidence: float):
        self.symbol = symbol
        self.signal_type = signal_type
        self.price = price
        self.timestamp = datetime.now().isoformat()
        self.confidence = confidence

def generate_technical_signals(market_data: dict) -> List[TradingSignal]:
    signals = []
    
    # Analyze crypto data
    for crypto in market_data.get('crypto', []):
        # Generate random signals for testing
        signal_type = random.choice(['BUY', 'SELL', 'HOLD'])
        confidence = random.uniform(0.6, 0.95)  # 60% to 95% confidence
        
        signals.append(TradingSignal(
            symbol=crypto['symbol'],
            signal_type=signal_type,
            price=crypto['price'],
            confidence=confidence
        ))
    
    # Analyze forex data
    for forex in market_data.get('forex', []):
        # Generate signals based on price movement
        price_change = forex['change']
        if abs(price_change) > 0.5:  # Significant movement
            signal_type = 'BUY' if price_change > 0 else 'SELL'
            confidence = min(0.7 + abs(price_change) / 2, 0.95)
            
            signals.append(TradingSignal(
                symbol=forex['symbol'],
                signal_type=signal_type,
                price=forex['price'],
                confidence=confidence
            ))
    
    # Analyze stock data
    for stock in market_data.get('stocks', []):
        # Generate signals based on volume and price movement
        volume_change = stock['volume'] / 1000000  # Normalize volume
        price_change = stock['change']
        
        if volume_change > 1 and abs(price_change) > 0.3:
            signal_type = 'BUY' if price_change > 0 else 'SELL'
            confidence = min(0.75 + (volume_change * 0.1), 0.95)
            
            signals.append(TradingSignal(
                symbol=stock['symbol'],
                signal_type=signal_type,
                price=stock['price'],
                confidence=confidence
            ))
    
    return signals

def get_trading_signals() -> List[dict]:
    """
    Generate trading signals based on market analysis.
    Returns a list of trading signals with their details.
    """
    try:
        # Get current market data
        market_data = get_market_analysis()
        
        # Generate signals based on market data
        signals = generate_technical_signals(market_data)
        
        # Convert signals to dictionary format
        return [
            {
                'id': f"{signal.symbol}_{signal.timestamp}",
                'symbol': signal.symbol,
                'signal_type': signal.signal_type,
                'price': signal.price,
                'timestamp': signal.timestamp,
                'confidence': signal.confidence
            }
            for signal in signals
        ]
    except Exception as e:
        print(f"Error generating signals: {e}")
        return [] 