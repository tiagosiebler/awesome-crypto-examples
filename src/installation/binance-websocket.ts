// Import websocket client at the top
import { WebsocketClient } from 'binance';

// initialise the websocket client
const wsClient = new WebsocketClient({
  api_key: 'insert api key here',
  api_secret: 'insert api secret here',
  beautify: true,
});
