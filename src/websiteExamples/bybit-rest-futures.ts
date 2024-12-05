// Import main client at the top
import { RestClientV5 } from 'bybit-api';

// initialise the client - bybit has unified client for spot and futures
const restClient = new RestClientV5({
  key: 'insert api key here',
  secret: 'insert api secret here',
});

async function publicCalls() {
  try {
    const orderBook = await restClient.getOrderbook({
      category: 'linear',
      symbol: 'BTCUSDT',
    });
    console.log('Orderbook: ', orderBook);

    const klineData = await restClient.getKline({
      category: 'linear',
      symbol: 'BTCUSDT',
      interval: '1',
    });
    console.log('Kline data: ', klineData);
  } catch (error) {
    console.error('public request failed: ', error);
  }
}

async function privateCalls() {
  try {
    const orderInfo = await restClient.submitOrder({
      category: 'linear',
      symbol: 'BTCUSDT',
      side: 'Buy',
      qty: '0.001',
      orderType: 'Market',
    });
    console.log('Order info: ', orderInfo);

    const balance = await restClient.getWalletBalance({
      accountType: 'UNIFIED',
    });
    console.log('Balance: ', balance);
  } catch (error) {
    console.error('private request failed: ', error);
  }
}

publicCalls();
privateCalls();
