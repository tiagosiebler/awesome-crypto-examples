import { WebsocketClient } from 'bybit-api';

/**
Either use environmental variables to try this, e.g. unix/mac:
APIKEY="APIKEYHERE" APISECRET="APISECRETHERE" ts-node src/exchanges/bybit/account-events/log-account-events-usdt.ts

or hardcode it:
const key = "APIKEYHERE";
const secret = "APISECRETHERE";

the below code reads it from env vars first. If none are provided, it defaults to the hardcoded strings:
**/
const key = process.env.APIKEY || 'YOURAPIKEYHERE';
const secret = process.env.APISECRET || 'YOURAPISECRETHERE';

const wsClient = new WebsocketClient({
  key: key,
  secret: secret,
  // USDT Perps
  market: 'linear',
  // Inverse Perps
  // market: 'inverse',
  // Spot
  // market: 'spotv3',
  testnet: false,
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
