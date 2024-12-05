// Import websocket client at the top
import { WebsocketClient } from 'bybit-api';

// initialise the websocket client
const wsClient = new WebsocketClient({
  key: 'insert api key here',
  secret: 'insert api secret here',
  market: 'v5',
});

// (v5) subscribe to multiple topics at once
wsClient.subscribeV5(
  ['orderbook.50.BTCUSDT', 'orderbook.50.ETHUSDT'],
  'linear',
);

// (v5) and/or subscribe to individual topics on demand
wsClient.subscribeV5('position', 'linear');
wsClient.subscribeV5('publicTrade.BTC', 'option');

// Listen to events coming from websockets. This is the primary data source
wsClient.on('update', (data) => {
  console.log('update', data);
});

// Optional: Listen to responses to websocket queries (e.g. the response after subscribing to a topic)
wsClient.on('response', (response) => {
  console.log('response', response);
});

// Optional: Listen to connection close event. Unexpected connection closes are automatically reconnected.
wsClient.on('close', () => {
  console.log('connection closed');
});

// Optional: Listen to raw error events. Recommended.
wsClient.on('error', (err) => {
  console.error('error', err);
});
