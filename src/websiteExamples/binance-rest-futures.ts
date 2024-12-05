// Import futures client at the top
import { CoinMClient, USDMClient } from 'binance';

// initialise the USDT margined futures client
const usdmFuturesClient = new USDMClient({
  api_key: 'insert api key here',
  api_secret: 'insert api secret here',
});

// initialise the COIN margined futures client
const coinMFuturesClient = new CoinMClient({
  api_key: 'insert api key here',
  api_secret: 'insert api secret here',
});

async function publicCalls() {
  try {
    const orderBook = await usdmFuturesClient.getOrderBook({
      symbol: 'BTCUSDT',
    });
    console.log('Orderbook: ', orderBook);

    const klineData = await usdmFuturesClient.getKlines({
      symbol: 'BTCUSDT',
      interval: '1m',
    });
    console.log('Kline data: ', klineData);
  } catch (error) {
    console.error('public request failed: ', error);
  }
}

async function privateCalls() {
  try {
    const orderInfo = await usdmFuturesClient.submitNewOrder({
      symbol: 'BTCUSDT',
      side: 'BUY',
      quantity: 0.001,
      type: 'MARKET',
    });
    console.log('Order info: ', orderInfo);

    const balance = await usdmFuturesClient.getBalance();
    console.log('Balance: ', balance);
  } catch (error) {
    console.error('private request failed: ', error);
  }
}

publicCalls();
privateCalls();
