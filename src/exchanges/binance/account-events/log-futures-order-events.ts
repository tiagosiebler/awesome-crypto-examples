import {
  isWsFormattedFuturesUserDataEvent,
  WebsocketClient,
  WsMessageFuturesUserDataTradeUpdateEventFormatted,
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

wsClient.on('formattedUserDataMessage', (data) => {
  return onUserDataEvent(data);
});

wsClient.subscribeUsdFuturesUserDataStream();

/**
 * Define a function to handle this sub-set of events
 */

function onUserDataEvent(event: WsUserDataEvents) {
  const dt = new Date(event.eventTime);
  // use type guard to make sure we're looking at futures user data events only
  if (isWsFormattedFuturesUserDataEvent(event)) {
    switch (event.eventType) {
      case 'ORDER_TRADE_UPDATE': {
        onOrderUpdateEvent(event, dt);
        break;
      }
      // There are other event types, if you're interested in them expand this switch statement to handle these `event.eventType` values
      // For example:
      // case 'ACCOUNT_UPDATE': {
      //   onAccountUpdateEvent(event, dt);
      //   break;
      // }
      default: {
        console.warn(
          `onFuturesUserDataEvent(${
            event.eventType
          }): unhandled event type: ${JSON.stringify(event, null, 2)}`,
        );
      }
    }
    return;
  }
}

function onOrderUpdateEvent(
  event: WsMessageFuturesUserDataTradeUpdateEventFormatted,
  dt: Date,
) {
  console.log(dt, `onOrderUpdateEvent(): `, JSON.stringify(event, null, 2));
}

// function onAccountUpdateEvent(
//   event: WsMessageFuturesUserDataAccountUpdateFormatted,
//   dt: Date,
// ) {
//   console.log(dt, `onAccountUpdateEvent(): `, JSON.stringify(event, null, 2));
// }
