import {
  API_ERROR_CODE,
  APIMarket,
  RestClientV5,
  WebsocketClient,
} from 'bybit-api';

/**
Either use environmental variables to try this, e.g. unix/mac:
APIKEY="APIKEYHERE" APISECRET="APISECRETHERE" ts-node src/exchanges/bybit/account-events/log-account-events-usdt.ts

or hardcode it:
const key = "APIKEYHERE";
const secret = "APISECRETHERE";

the below code reads it from env vars first. If none are provided, it defaults to the hardcoded strings:
**/
const apiKey = process.env.API_KEY_COM || 'your_api_key_here';
const apiSecret = process.env.API_SECRET_COM || 'your_api_secret_here';
const testnet = false;

/**
 * This sample is a simple demonstration of opening and closing OneWay positions on USDT (linear) perps on bybit.
 */

// Purely for logging, connect to account websocket events to monitor activity
connectAndListenToAccountWebsocketEvents(apiKey, apiSecret, 'v5');

// Start REST API calls for submitting orders
submitUsdtPerpOrders(apiKey, apiSecret);

// optional, but this could be used to make an async version of this that doesn't make REST API calls to check position changes
function connectAndListenToAccountWebsocketEvents(
  key: string,
  secret: string,
  apiMarket: APIMarket,
) {
  const wsClient = new WebsocketClient({
    key: key,
    secret: secret,
    market: apiMarket,
    testnet: testnet,
  });

  wsClient.on('update', (data) => {
    console.log('ws event: ', JSON.stringify(data, null, 2));
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
  wsClient.subscribeV5(['position', 'execution', 'order', 'wallet'], 'linear');
}

async function submitUsdtPerpOrders(apiKey: string, apiSecret: string) {
  try {
    const restClient = new RestClientV5({
      key: apiKey,
      secret: apiSecret,
      testnet: testnet,
    });

    const TARGET_LEVERAGE = 5;
    const TARGET_SYMBOL = 'BTCUSDT';
    const BTC_AMOUNT_TO_TRADE = 0.001;

    const walletBalanceResponse = await restClient.getWalletBalance({
      accountType: 'UNIFIED',
    });
    const USDTBalanceObject = walletBalanceResponse.result.list[0].coin.find(
      (coinBalance) => coinBalance.coin === 'USDT',
    );

    const usdtBalance = USDTBalanceObject.walletBalance;

    console.log(
      'usdtBalance: ',
      usdtBalance,
      // JSON.stringify(walletBalanceResponse, null, 2),
    );

    // set mode to one-way (easier than hedge-mode, if you don't care for hedge mode)
    const positionModeResult = await restClient.switchPositionMode({
      category: 'linear',
      symbol: TARGET_SYMBOL,
      mode: 0,
    });

    if (
      positionModeResult.retCode === API_ERROR_CODE.POSITION_MODE_NOT_MODIFIED
    ) {
      console.log('position mode was already correct: ', positionModeResult);
    } else {
      console.log('position mode change result: ', positionModeResult);
    }

    // log current positions (and leverage per symbol)
    const positionResult = await restClient.getPositionInfo({
      category: 'linear',
      symbol: TARGET_SYMBOL,
    });

    console.log(
      'positions: ',
      positionResult.result.list.map((pos) => {
        return {
          symbol: pos.symbol,
          leverage: pos.leverage,
          mode: pos.tradeMode,
          size: pos.size,
          side: pos.side,
        };
      }),
    );

    // change leverage, only if needed
    const leverageToChange = positionResult.result.list.filter(
      (pos) => pos.leverage !== TARGET_LEVERAGE.toString(),
    );

    if (leverageToChange.length) {
      const setLeverageResult = await restClient.setLeverage({
        symbol: TARGET_SYMBOL,
        buyLeverage: TARGET_LEVERAGE.toString(),
        sellLeverage: TARGET_LEVERAGE.toString(),
        category: 'linear',
      });

      console.log(
        'setLeverageResult: ',
        JSON.stringify(setLeverageResult, null, 2),
      );
    } else {
      console.log('no leverage change needed');
    }

    console.log('entering long position: ');
    const successEntryLong = await enterLongPosition(
      restClient,
      TARGET_SYMBOL,
      BTC_AMOUNT_TO_TRADE,
    );
    if (!successEntryLong) {
      // dont continue on fail
      return;
    }

    const sleepSecondsBetweenOrder = 1;
    await new Promise((resolve) =>
      setTimeout(resolve, sleepSecondsBetweenOrder * 1000),
    );

    console.log('closing long position: ');
    const successExitLong = await closeLongPosition(restClient, TARGET_SYMBOL);
    if (!successExitLong) {
      // dont continue on fail
      return;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, sleepSecondsBetweenOrder * 1000),
    );

    console.log('entering short position: ');
    const successEntryShort = await enterShortPosition(
      restClient,
      TARGET_SYMBOL,
      BTC_AMOUNT_TO_TRADE,
    );
    if (!successEntryShort) {
      // dont continue on fail
      return;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, sleepSecondsBetweenOrder * 1000),
    );

    console.log('closing short position: ');
    const successExitShort = await closeShortPosition(
      restClient,
      TARGET_SYMBOL,
    );
    if (!successExitShort) {
      // dont continue on fail
      return;
    }

    console.log('reached end - hit ctrl + C to kill the process');
  } catch (error) {
    console.error('Error submitting USDT perp orders:', error);
  }
}

async function enterLongPosition(
  restClient: RestClientV5,
  symbol: string,
  quantity: number,
): Promise<boolean> {
  // Open a long position by making a long entry order (buying so the position qty is positive)
  const entryOrderResult = await restClient.submitOrder({
    category: 'linear',
    side: 'Buy',
    symbol: symbol,
    orderType: 'Market',
    qty: quantity.toString(),
    timeInForce: 'GTC',
    reduceOnly: false,
    closeOnTrigger: false,
    positionIdx: 0,
  });

  if (entryOrderResult.retMsg !== 'OK') {
    console.error(
      `ERROR making long entry order: `,
      JSON.stringify(entryOrderResult, null, 2),
    );
    return false;
  }

  console.log('success - long entry order: ', JSON.stringify(entryOrderResult));
  return true;
}

// shorting is just making sure you have a negative position
async function enterShortPosition(
  restClient: RestClientV5,
  symbol: string,
  quantity: number,
): Promise<boolean> {
  // Open a short position by making a long entry order (selling so the position qty is negative)
  const entryOrderResult = await restClient.submitOrder({
    category: 'linear',
    side: 'Sell',
    symbol: symbol,
    orderType: 'Market',
    qty: quantity.toString(),
    timeInForce: 'GTC',
    reduceOnly: false,
    closeOnTrigger: false,
    positionIdx: 0,
  });

  if (entryOrderResult.retMsg !== 'OK') {
    console.error(
      `ERROR making long entry order: `,
      JSON.stringify(entryOrderResult, null, 2),
    );
    return false;
  }

  console.log('success - long entry order: ', JSON.stringify(entryOrderResult));
  return true;
}

async function closeLongPosition(
  restClient: RestClientV5,
  symbol: string,
): Promise<boolean> {
  const positionResult = await restClient.getPositionInfo({
    category: 'linear',
    symbol: symbol,
  });

  const activePosition = positionResult.result.list.find(
    (pos) => pos.symbol === symbol,
  );

  console.log('active position: ', activePosition);
  if (!activePosition || activePosition.side !== 'Buy') {
    console.error('no long position to close');
    return false;
  }

  // submit reduce only sell to close long position
  const closePositionResult = await restClient.submitOrder({
    category: 'linear',
    side: 'Sell',
    symbol: symbol,
    orderType: 'Market',
    qty: activePosition.size, // using position size from api response
    timeInForce: 'GTC',
    reduceOnly: true,
    closeOnTrigger: false,
    positionIdx: 0,
  });

  if (closePositionResult.retMsg !== 'OK') {
    console.error(
      `error closing long position: `,
      JSON.stringify(closePositionResult, null, 2),
    );
    return false;
  }

  console.log('success - reduce long position: ', closePositionResult);
  return true;
}

async function closeShortPosition(
  restClient: RestClientV5,
  symbol: string,
): Promise<boolean> {
  const positionResult = await restClient.getPositionInfo({
    category: 'linear',
    symbol: symbol,
  });

  const activePosition = positionResult.result.list.find(
    (pos) => pos.symbol === symbol,
  );

  console.log('active position: ', activePosition);
  if (!activePosition || activePosition.side !== 'Sell') {
    console.error('no short position to close');
    return false;
  }

  // submit reduce only buy to close short position
  const closePositionResult = await restClient.submitOrder({
    category: 'linear',
    side: 'Buy',
    symbol: symbol,
    orderType: 'Market',
    qty: activePosition.size, // using position size from api response
    timeInForce: 'GTC',
    reduceOnly: true,
    closeOnTrigger: false,
    positionIdx: 0,
  });

  if (closePositionResult.retMsg !== 'OK') {
    console.error(
      `error closing short position: `,
      JSON.stringify(closePositionResult, null, 2),
    );
    return false;
  }

  console.log('success - reduce short position: ', closePositionResult);
  return true;
}
