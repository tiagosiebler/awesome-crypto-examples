// Import main client at the top
import { RestClientV5 } from 'bybit-api';

// initialise the client - bybit has unified client for spot and futures
const restClient = new RestClientV5({
  key: 'insert api key here',
  secret: 'insert api secret here',
});

async function publicCalls() {
  try {
    const oneTicker = await restClient.getInstrumentsInfo({
      category: 'spot',
      symbol: 'BTCUSDT',
    });
    console.log('one ticker: ', oneTicker);

    const allTickers = await restClient.getTickers({
      category: 'spot',
    });
    console.log('all tickers: ', allTickers);
  } catch (error) {
    console.error('public request failed: ', error);
  }
}

async function privateCalls() {
  try {
    const accountInfo = await restClient.getAccountInfo();
    console.log('account info: ', accountInfo);

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
