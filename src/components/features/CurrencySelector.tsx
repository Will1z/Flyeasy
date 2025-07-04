import React from 'react';
import { DollarSign, Globe } from 'lucide-react';
import { Currency } from '../../types';

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  className?: string;
}

const currencies: Currency[] = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.0013 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.0012 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.0010 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 0.0018 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 0.0020 }
];

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  className = ''
}) => {
  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        <Globe className="h-4 w-4 text-gray-500" />
        <select
          value={selectedCurrency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none pr-8"
        >
          {currencies.map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.code}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export const convertPrice = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
  const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1;
  
  // Convert to base currency (NGN) then to target currency
  const baseAmount = amount / fromRate;
  return baseAmount * toRate;
};

export const formatPrice = (amount: number, currency: string): string => {
  const currencyData = currencies.find(c => c.code === currency);
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'NGN' ? 0 : 2
  }).format(amount);
};

export default CurrencySelector;