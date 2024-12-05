// Import main client at the top
import { MainClient } from 'binance';

// initialise the client
const spotClient = new MainClient({
  api_key: 'insert api key here',
  api_secret: 'insert api secret here',
});

async function publicCalls() {
  try {
    const oneTicker = await spotClient.get24hrChangeStatististics({
      symbol: 'BTCUSDT',
    });
    console.log('one ticker: ', oneTicker);

    const allTickers = await spotClient.get24hrChangeStatististics();
    console.log('all tickers: ', allTickers);
  } catch (error) {
    console.error('public request failed: ', error);
  }
}

async function privateCalls() {
  try {
    const accountInfo = await spotClient.getAccountInformation();
    console.log('account info: ', accountInfo);

    const balance = await spotClient.getBalances();
    console.log('balance: ', balance);
  } catch (error) {
    console.error('private request failed: ', error);
  }
}

publicCalls();
privateCalls();
