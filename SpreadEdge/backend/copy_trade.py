from typing import List, Dict
import random
from datetime import datetime, timedelta

class Trader:
    def __init__(self, id: str, name: str, performance: float, trades: int, win_rate: float):
        self.id = id
        self.name = name
        self.performance = performance
        self.trades = trades
        self.win_rate = win_rate
        self.is_following = False

def generate_mock_traders() -> List[Dict]:
    """Generate mock data for copy trading."""
    traders = [
        Trader(
            id="1",
            name="CryptoMaster",
            performance=random.uniform(15.0, 30.0),
            trades=random.randint(100, 500),
            win_rate=random.uniform(0.65, 0.85)
        ),
        Trader(
            id="2",
            name="ForexPro",
            performance=random.uniform(12.0, 25.0),
            trades=random.randint(80, 400),
            win_rate=random.uniform(0.60, 0.80)
        ),
        Trader(
            id="3",
            name="StockGuru",
            performance=random.uniform(10.0, 20.0),
            trades=random.randint(50, 300),
            win_rate=random.uniform(0.70, 0.90)
        ),
        Trader(
            id="4",
            name="DayTrader",
            performance=random.uniform(8.0, 18.0),
            trades=random.randint(200, 800),
            win_rate=random.uniform(0.55, 0.75)
        ),
        Trader(
            id="5",
            name="SwingKing",
            performance=random.uniform(20.0, 35.0),
            trades=random.randint(30, 150),
            win_rate=random.uniform(0.75, 0.95)
        )
    ]
    
    return [
        {
            "id": trader.id,
            "name": trader.name,
            "performance": trader.performance,
            "trades": trader.trades,
            "winRate": trader.win_rate,
            "isFollowing": trader.is_following
        }
        for trader in traders
    ]

def get_available_traders() -> List[Dict]:
    """Get list of available traders for copy trading."""
    return generate_mock_traders()

def toggle_follow_status(trader_id: str) -> bool:
    """Toggle follow status for a trader."""
    # In a real implementation, this would update the database
    # For now, we'll just return True to indicate success
    return True 