import {
  API_ERROR_CODE,
  APIMarket,
  LinearClient,
  LinearPositionIdx,
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
const apiKey = process.env.API_KEY_COM || 'yourAPIKeyHere';
const apiSecret = process.env.API_SECRET_COM || 'yourAPISecretHere';
const testnet = false;

/**
 * This sample is a simple demonstration of opening and closing OneWay positions on USDT (linear) perps on bybit.
 */

// Purely for logging, connect to account websocket events to monitor activity
connectAndListenToAccountWebsocketEvents(apiKey, apiSecret, 'linear');

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
  wsClient.subscribe(['position', 'execution', 'order', 'wallet']);
}

async function submitUsdtPerpOrders(apiKey: string, apiSecret: string) {
  const restClient = new LinearClient({
    key: apiKey,
    secret: apiSecret,
    testnet: testnet,
  });

  const TARGET_LEVERAGE = 5;
  const TARGET_SYMBOL = 'BTCUSDT';
  const BTC_AMOUNT_TO_TRADE = 0.001;

  const walletBalanceResponse = await restClient.getWalletBalance();
  const usdtBalance = walletBalanceResponse.result.USDT?.available_balance;

  console.log(
    'usdtBalance: ',
    usdtBalance,
    // JSON.stringify(walletBalanceResponse, null, 2),
  );

  // set mode to one-way (easier than hedge-mode, if you don't care for hedge mode)
  const positionModeResult = await restClient.setPositionMode({
    symbol: TARGET_SYMBOL,
    mode: 'MergedSingle',
  });

  if (
    positionModeResult.ret_code === API_ERROR_CODE.POSITION_MODE_NOT_MODIFIED
  ) {
    console.log('position mode was already correct: ', positionModeResult);
  } else {
    console.log('position mode change result: ', positionModeResult);
  }

  // log current positions (and leverage per symbol)
  const positionResult = await restClient.getPosition({
    symbol: TARGET_SYMBOL,
  });

  console.log(
    'positions: ',
    positionResult.result.map((pos) => {
      return {
        symbol: pos.symbol,
        leverage: pos.leverage,
        mode: pos.mode,
        size: pos.size,
        side: pos.side,
      };
    }),
  );

  // change leverage, only if needed
  const leverageToChange = positionResult.result.filter(
    (pos) => pos.leverage !== TARGET_LEVERAGE,
  );

  if (leverageToChange.length) {
    const setLeverageResult = await restClient.setUserLeverage({
      symbol: TARGET_SYMBOL,
      buy_leverage: TARGET_LEVERAGE,
      sell_leverage: TARGET_LEVERAGE,
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
  const successExitShort = await closeShortPosition(restClient, TARGET_SYMBOL);
  if (!successExitShort) {
    // dont continue on fail
    return;
  }

  console.log('reached end - hit ctrl + C to kill the process');
}

async function enterLongPosition(
  restClient: LinearClient,
  symbol: string,
  quantity: number,
): Promise<boolean> {
  // Open a long position by making a long entry order (buying so the position qty is positive)
  const entryOrderResult = await restClient.placeActiveOrder({
    side: 'Buy',
    symbol: symbol,
    order_type: 'Market',
    qty: quantity,
    time_in_force: 'GoodTillCancel',
    reduce_only: false,
    close_on_trigger: false,
    position_idx: LinearPositionIdx.OneWayMode,
  });

  if (entryOrderResult.ret_msg !== 'OK') {
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
  restClient: LinearClient,
  symbol: string,
  quantity: number,
): Promise<boolean> {
  // Open a short position by making a long entry order (selling so the position qty is negative)
  const entryOrderResult = await restClient.placeActiveOrder({
    side: 'Sell',
    symbol: symbol,
    order_type: 'Market',
    qty: quantity,
    time_in_force: 'GoodTillCancel',
    reduce_only: false,
    close_on_trigger: false,
    position_idx: LinearPositionIdx.OneWayMode,
  });

  if (entryOrderResult.ret_msg !== 'OK') {
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
  restClient: LinearClient,
  symbol: string,
): Promise<boolean> {
  const positionResult = await restClient.getPosition({
    symbol: symbol,
  });

  const activePosition = positionResult.result.find(
    (pos) => pos.symbol === symbol,
  );

  console.log('active position: ', activePosition);
  if (!activePosition || activePosition.side !== 'Buy') {
    console.error('no long position to close');
    return false;
  }

  // submit reduce only sell to close long position
  const closePositionResult = await restClient.placeActiveOrder({
    side: 'Sell',
    symbol: symbol,
    order_type: 'Market',
    qty: activePosition.size, // using position size from api response
    time_in_force: 'GoodTillCancel',
    reduce_only: true,
    close_on_trigger: false,
    position_idx: LinearPositionIdx.OneWayMode,
  });

  if (closePositionResult.ret_msg !== 'OK') {
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
  restClient: LinearClient,
  symbol: string,
): Promise<boolean> {
  const positionResult = await restClient.getPosition({
    symbol: symbol,
  });

  const activePosition = positionResult.result.find(
    (pos) => pos.symbol === symbol,
  );

  console.log('active position: ', activePosition);
  if (!activePosition || activePosition.side !== 'Sell') {
    console.error('no short position to close');
    return false;
  }

  // submit reduce only buy to close short position
  const closePositionResult = await restClient.placeActiveOrder({
    side: 'Buy',
    symbol: symbol,
    order_type: 'Market',
    qty: activePosition.size, // using position size from api response
    time_in_force: 'GoodTillCancel',
    reduce_only: true,
    close_on_trigger: false,
    position_idx: LinearPositionIdx.OneWayMode,
  });

  if (closePositionResult.ret_msg !== 'OK') {
    console.error(
      `error closing short position: `,
      JSON.stringify(closePositionResult, null, 2),
    );
    return false;
  }

  console.log('success - reduce short position: ', closePositionResult);
  return true;
}
