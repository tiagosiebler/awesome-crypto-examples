import {
  DefaultLogger,
  isWsFormatted24hrTicker,
  isWsFormattedKline,
  WebsocketClient,
} from 'binance';

const market = 'BTCUSDT';
const coinMSymbol = 'AVAXUSD_PERP';

// Optional: override the logger used by the websocket client to reduce/increase how much debug info is printed (e.g. websocket ping/pong events)
const logger = {
  ...DefaultLogger,
  // silly: () => {},
};

const wsClient = new WebsocketClient(
  {
    beautify: true,
  },
  logger,
);

// raw, unbeautified events
wsClient.on('message', (data) => {
  // console.log('raw message received ', JSON.stringify(data, null, 2));
});

// OR, formatted events with readable properties:
wsClient.on('formattedMessage', (data) => {
  // manually handle events with if blocks and narrow down to desired types
  // if (!Array.isArray(data) && data.eventType === 'kline') {
  //   console.log('kline received ', data.kline);
  //   return;
  // }

  // or use a supplied type guard (if available - not all type guards have been written yet)
  if (isWsFormattedKline(data)) {
    console.log('kline received ', data.kline);
    return;
  }

  if (isWsFormatted24hrTicker(data)) {
    console.log('24hrTicker received ', data);
    return;
  }

  console.log('log formattedMessage: ', data);
});

// monitor life cycle events related to websockets
wsClient.on('open', (data) => {
  console.log('connection opened open:', data.wsKey, data.ws.target.url);
});
// response to command sent via WS stream (e.g LIST_SUBSCRIPTIONS)
wsClient.on('reply', (data) => {
  console.log('log reply: ', JSON.stringify(data, null, 2));
});
wsClient.on('reconnecting', (data) => {
  console.log('ws automatically reconnecting.... ', data?.wsKey);
});
wsClient.on('reconnected', (data) => {
  console.log('ws has reconnected ', data?.wsKey);
});

// Subscribe to the topics you're interested in
// Refer to the websocket client source for a full list of exposed topics:
// https://github.com/tiagosiebler/binance/blob/master/src/websocket-client.ts#L847

wsClient.subscribeKlines(market, '1m', 'usdm');
// wsClient.subscribeCoinIndexPrice(coinMSymbol);
// wsClient.subscribeSpotKline(market, '1m');
// wsClient.subscribeMarkPrice(market, 'usdm');
// wsClient.subscribeMarkPrice(coinMSymbol, 'coinm');
// wsClient.subscribeAllMarketMarkPrice('usdm');
// wsClient.subscribeAllMarketMarkPrice('coinm');
// wsClient.subscribeKlines(market, '1m', 'usdm');
// wsClient.subscribeContinuousContractKlines(market, 'perpetual', '1m', 'usdm');
// wsClient.subscribeIndexKlines(coinMSymbol, '1m');
// wsClient.subscribeMarkPriceKlines(coinMSymbol, '1m');
// wsClient.subscribeSymbolMini24hrTicker(market, 'usdm');
// wsClient.subscribeSymbolMini24hrTicker(coinMSymbol, 'coinm');
// wsClient.subscribeSymbolMini24hrTicker(market, 'spot');
// wsClient.subscribeSymbol24hrTicker(market, 'usdm');
// wsClient.subscribeSymbol24hrTicker(market, 'coinm');
// wsClient.subscribeSymbol24hrTicker(coinMSymbol, 'spot');
// wsClient.subscribeAllMini24hrTickers('usdm');
// wsClient.subscribeAllMini24hrTickers('coinm');
// wsClient.subscribeAllMini24hrTickers('spot');
// wsClient.subscribeAll24hrTickers('usdm');
// wsClient.subscribeAll24hrTickers('coinm');
// wsClient.subscribeAll24hrTickers('spot');
// wsClient.subscribeAllLiquidationOrders('usdm');
// wsClient.subscribeAllLiquidationOrders('coinm');
// wsClient.subscribeSpotSymbol24hrTicker(market);
// wsClient.subscribeAggregateTrades(market, 'usdm');
// wsClient.subscribeSpotPartialBookDepth('ETHBTC', 5, 1000);
