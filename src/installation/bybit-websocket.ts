// Import websocket client at the top
import { WebsocketClient } from 'bybit-api';

// initialise the client
const websocketClient = new WebsocketClient({
  key: 'insert api key here',
  secret: 'insert api secret here',
  market: 'v5', //optional
});
