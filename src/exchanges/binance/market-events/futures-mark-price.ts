import {
  isWsFormatted24hrTicker,
  isWsFormattedKline,
  isWsFormattedMarkPriceUpdateEvent,
  WebsocketClient,
} from 'binance';

const market = 'BTCUSDT';
const coinMSymbol = 'AVAXUSD_PERP';

const wsClient = new WebsocketClient({
  beautify: true,
});

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

  if (isWsFormattedMarkPriceUpdateEvent(data)) {
    console.log('mark price received ', data);
    return;
  }

  console.log('log formattedMessage: ', data);
});

// monitor life cycle events related to websockets
wsClient.on('open', (data) => {
  console.log('connection opened open:', data.wsKey, data.ws.target.url);
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

wsClient.subscribeMarkPrice(market, 'usdm', 1000);
