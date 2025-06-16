'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import { socketClient as ws } from '../lib/api/bybit-clients';


ws.on('update', (data) => {
  console.log('data received', data);
});

ws.on('open', (data) => {
  console.log('connection opened open:', data.wsKey);
});
ws.on('response', (data) => {
  console.log('log response: ', JSON.stringify(data, null, 2));
});
ws.on('reconnect', ({ wsKey }) => {
  console.log('ws automatically reconnecting.... ', wsKey);
});
ws.on('reconnected', (data) => {
  console.log('ws has reconnected ', data?.wsKey);
});

ws.on('exception', (data) => {
  console.error('ws exception: ', data);
});

export default function OptionSelector() {
  const [selectedOption, setSelectedOption] = useState('');

  const handleValueChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    if (value) {
      if (selectedOption && selectedOption !== value) {
        ws.unsubscribeV5(`tickers.${selectedOption}`, 'linear');
      }

      ws.subscribeV5(`tickers.${value}`, 'linear');
      
    } else {
       if (selectedOption) {
        ws.unsubscribeV5(`ticker.${selectedOption}`, 'linear');
      } 
    }

    setSelectedOption(value);
  };

  useEffect(() => {
    console.log(selectedOption);
  }, [selectedOption]);

  return (
    <div>
      <select
        onChange={handleValueChange}
        value={selectedOption}
        name="option-selector"
      >
        <option value="">Select an option</option>
        <option value="BTCUSDT">BTCUSDT</option>
        <option value="ETHUSDT">ETHUSDT</option>
        <option value="SOLUSDT">SOLUSDT</option>
      </select>
    </div>
  );
}
