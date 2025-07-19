import React, { useState, useRef, useEffect } from 'react';

interface CryptoDropdownProps {
  selectedCrypto: string;
  onCryptoChange: (crypto: string) => void;
}

interface CryptoOption {
  symbol: string;
  name: string;
  icon: string;
}

const cryptoOptions: CryptoOption[] = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', icon: '◎' },
  { symbol: 'BNB', name: 'Binance Coin', icon: '⬢' },
];

const CryptoDropdown: React.FC<CryptoDropdownProps> = ({ selectedCrypto, onCryptoChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = cryptoOptions.find(option => option.symbol === selectedCrypto);
  
  const filteredOptions = cryptoOptions.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (crypto: string) => {
    onCryptoChange(crypto);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  return (
    <div className="crypto-dropdown" ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={toggleDropdown}>
        <div className="selected-crypto">
          <span className="crypto-icon">{selectedOption?.icon}</span>
          <div className="crypto-details">
            <span className="crypto-symbol">{selectedOption?.symbol}</span>
            <span className="crypto-name">{selectedOption?.name}</span>
          </div>
        </div>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="search-container">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search cryptocurrency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="options-container">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.symbol}
                  className={`dropdown-option ${selectedCrypto === option.symbol ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.symbol)}
                >
                  <span className="crypto-icon">{option.icon}</span>
                  <div className="crypto-details">
                    <span className="crypto-symbol">{option.symbol}</span>
                    <span className="crypto-name">{option.name}</span>
                  </div>
                  {selectedCrypto === option.symbol && (
                    <span className="check-icon">✓</span>
                  )}
                </div>
              ))
            ) : (
              <div className="no-results">
                No cryptocurrencies found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoDropdown; 