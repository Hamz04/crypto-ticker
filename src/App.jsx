import React, { useState, useEffect } from 'react';
import axios from 'axios';

const COINS = ['bitcoin','ethereum','solana','cardano','polkadot','chainlink','avalanche-2','polygon'];

function CoinRow({ coin }) {
  const positive = coin.price_change_percentage_24h > 0;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#1a1a2e', borderRadius: 12, marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={coin.image} alt={coin.name} width={36} height={36} style={{ borderRadius: '50%' }} />
        <div>
          <div style={{ color: 'white', fontWeight: 600 }}>{coin.name}</div>
          <div style={{ color: '#888', fontSize: 12 }}>{coin.symbol.toUpperCase()}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>${coin.current_price.toLocaleString()}</div>
        <div style={{ color: positive ? '#22c55e' : '#ef4444', fontSize: 14 }}>
          {positive ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPrices = async () => {
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(',')}&order=market_cap_desc&sparkline=false`
      );
      setCoins(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = coins.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', padding: '40px 24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#f59e0b', textAlign: 'center', marginBottom: 32 }}>📈 Crypto Ticker</h1>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search coins..." style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: 'none', marginBottom: 16, fontSize: 16, boxSizing: 'border-box' }} />
        {loading ? <p style={{ color: 'white', textAlign: 'center' }}>Loading prices...</p> : filtered.map(coin => <CoinRow key={coin.id} coin={coin} />)}
        <p style={{ color: '#555', textAlign: 'center', fontSize: 12, marginTop: 16 }}>Updates every 30s — powered by CoinGecko</p>
      </div>
    </div>
  );
}
