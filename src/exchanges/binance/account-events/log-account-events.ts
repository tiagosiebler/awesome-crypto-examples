import {
  isWsFormattedFuturesUserDataEvent,
  isWsFormattedSpotUserDataEvent,
  isWsFormattedUserDataEvent,
  WebsocketClient,
  WsUserDataEvents,
} from 'binance';

const key = process.env.APIKEY || 'APIKEY';
const secret = process.env.APISECRET || 'APISECRET';

/**
 * Prepare websocket client and connect the event handlers you're interested in
 */
const wsClient = new WebsocketClient({
  api_key: key,
  api_secret: secret,
  // some events have numbers stored as strings or unreadable properties (e.g E instead of `eventTime`)
  // the beautifier processes these into more intuitive types
  beautify: true,
});

// ALL RAW websocket events will be printed here:
wsClient.on('message', (data) => {
  // console.log('raw message received ', JSON.stringify(data, null, 2));
});

// OR listen to only formatted messages (requires beautify:true)
wsClient.on('formattedMessage', (data) => {
  // The wsKey can be parsed to determine the type of message (which websocket connection it came from)
  // if (!Array.isArray(data) && data.wsKey.includes('userData')) {
  //   return onUserDataEvent(data);
  // }

  // or use a type guard if available
  if (isWsFormattedUserDataEvent(data)) {
    return onUserDataEvent(data);
  }

  // any other unhandled formatted events for topics you've subscribed to:
  console.log(new Date(), 'formattedMsg: ', JSON.stringify(data, null, 2));
});

// OR use a dedicated event that only provides user data updates (if you notice any are missing here, check the on('message') handler)
// wsClient.on('formattedUserDataMessage', data => {
//   return onUserDataEvent(data);
// });

/**
 * Call the subscribe functions for the user data categories you're interested in (e.g. spot and usd future events)
 */

wsClient.subscribeSpotUserDataStream();
// wsClient.subscribeMarginUserDataStream();
// wsClient.subscribeIsolatedMarginUserDataStream('BTCUSDT');
wsClient.subscribeUsdFuturesUserDataStream();

/**
 * Define a function to handle this sub-set of events
 */

function onUserDataEvent(data: WsUserDataEvents) {
  // the wsMarket property denotes which API category it came from (e.g. spot vs futures)
  // if (data.wsMarket.includes('spot')) {

  // or use a type guard, (if one exists already - or make a pull request to add them to the connector)
  if (isWsFormattedSpotUserDataEvent(data)) {
    console.log(
      new Date(),
      'spot user data event: ',
      JSON.stringify(data, null, 2),
    );
    return;
  }

  if (data.wsMarket.includes('margin')) {
    console.log(
      new Date(),
      'margin user data event: ',
      JSON.stringify(data, null, 2),
    );
    return;
  }

  if (data.wsMarket.includes('isolatedMargin')) {
    console.log(
      new Date(),
      'isolatedMargin user data event: ',
      JSON.stringify(data, null, 2),
    );
    return;
  }

  if (data.wsMarket.includes('usdmTestnet')) {
    console.log(
      new Date(),
      'usdmTestnet user data event: ',
      JSON.stringify(data, null, 2),
    );
    return;
  }

  if (isWsFormattedFuturesUserDataEvent(data)) {
    console.log(
      new Date(),
      'usdm user data event: ',
      JSON.stringify(data, null, 2),
    );
    return;
  }
}
