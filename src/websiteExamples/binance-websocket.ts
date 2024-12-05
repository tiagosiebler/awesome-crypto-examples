// Import websocket client at the top
import { WebsocketClient } from 'binance';

// initialise the websocket client
const wsClient = new WebsocketClient({
  api_key: 'insert api key here',
  api_secret: 'insert api secret here',
  beautify: true,
});

wsClient.subscribeSpotUserDataStream();
wsClient.subscribeMarginUserDataStream();
wsClient.subscribeIsolatedMarginUserDataStream('BTCUSDT');
wsClient.subscribeUsdFuturesUserDataStream();

// receive raw events
wsClient.on('message', (data) => {
  console.log('raw message received ', JSON.stringify(data, null, 2));
});

// receive formatted events with beautified keys. Any "known" floats stored in strings as parsed as floats.
wsClient.on('formattedMessage', (data) => {
  console.log('formattedMessage: ', data);
});

// receive notification that a reconnection completed successfully (e.g use REST to check for missing data)
wsClient.on('reconnected', (data) => {
  console.log('ws has reconnected ', data?.wsKey);
});

// Recommended: receive error events (e.g. first reconnection failed)
wsClient.on('error', (data) => {
  console.log('ws saw error ', data?.wsKey);
});
