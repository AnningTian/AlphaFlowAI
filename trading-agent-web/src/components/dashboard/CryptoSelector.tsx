import React from 'react';

interface CryptoSelectorProps {
  selectedCrypto: string;
  onCryptoChange: (crypto: string) => void;
}

const CryptoSelector: React.FC<CryptoSelectorProps> = ({ selectedCrypto, onCryptoChange }) => {
  const cryptocurrencies = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'SOL', name: 'Solana' }
  ];

  return (
    <div className="crypto-selector">
      <h3>Select Cryptocurrency</h3>
      <div className="crypto-options">
        {cryptocurrencies.map((crypto) => (
          <button
            key={crypto.symbol}
            className={`crypto-option ${selectedCrypto === crypto.symbol ? 'active' : ''}`}
            onClick={() => onCryptoChange(crypto.symbol)}
          >
            <span className="crypto-symbol">{crypto.symbol}</span>
            <span className="crypto-name">{crypto.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CryptoSelector; 