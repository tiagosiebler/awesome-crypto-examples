import { WebsocketClient } from 'bybit-api';

const key = process.env.APIKEY || 'APIKEY';
const secret = process.env.APISECRET || 'APISECRET';

// USDT Perps:
const market = 'linear';
// Inverse Perp
// const market = 'inverse';
// const market = 'spot';

// Note: the WebsocketClient defaults to testnet. Set `livenet: true` to use live markets.
const wsClient = new WebsocketClient({
  key: key,
  secret: secret,
  market: market,
  livenet: true,
  restOptions: {
    // disable_time_sync: true,
  },
});

wsClient.on('update', (data) => {
  console.log('raw message received ', JSON.stringify(data, null, 2));
});

wsClient.on('open', (data) => {
  console.log('ws connection opened:', data.wsKey);
});
wsClient.on('response', (data) => {
  console.log('ws response: ', JSON.stringify(data, null, 2));
});
wsClient.on('reconnect', ({ wsKey }) => {
  console.log('ws automatically reconnecting.... ', wsKey);
});
wsClient.on('reconnected', (data) => {
  console.log('ws has reconnected ', data?.wsKey);
});

// subscribe to private endpoints
wsClient.subscribe(['position', 'execution', 'order', 'wallet']);
