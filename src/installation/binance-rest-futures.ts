// Import futures client at the top
import { CoinMClient, USDMClient } from 'binance';

// initialise the USDT margined futures client
const USDMFuturesClient = new USDMClient({
  api_key: 'insert api key here',
  api_secret: 'insert api secret here',
});

// initialise the COIN margined futures client
const COINMFuturesClient = new CoinMClient({
  api_key: 'insert api key here',
  api_secret: 'insert api secret here',
});
