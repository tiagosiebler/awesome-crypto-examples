/**
 *
 * A simple demo subscribing to balance updates on a single USDM futures account. These are seen when account events happen (such as order fills)
 *
 */

import {
  isWsFormattedFuturesUserDataEvent,
  WebsocketClient,
  WsMessageFuturesUserDataAccountUpdateFormatted,
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
// wsClient.on('formattedMessage', (data) => {
//   // The wsKey can be parsed to determine the type of message (which websocket connection it came from)
//   // if (!Array.isArray(data) && data.wsKey.includes('userData')) {
//   //   return onUserDataEvent(data);
//   // }

//   // or use a type guard if available
//   if (isWsFormattedUserDataEvent(data)) {
//     return onUserDataEvent(data);
//   }

//   // any other unhandled formatted events for topics you've subscribed to:
//   console.log(new Date(), 'formattedMsg: ', JSON.stringify(data, null, 2));
// });

// OR use a dedicated event that only provides user data updates (if you notice any are missing here, check the on('message') handler)
wsClient.on('formattedUserDataMessage', (data) => {
  return onUserDataEvent(data);
});

wsClient.on('error', (data) => {
  console.log(new Date(), `Error in connection`, data);
});
wsClient.on('open', () => {
  console.log(new Date(), `Connected to account`);
});

/**
 * Call the subscribe functions for the user data categories you're interested in (e.g. usd future events)
 */
try {
  wsClient.subscribeUsdFuturesUserDataStream();
} catch (e) {
  console.error(new Date(), `Exception connecting to account`, e);
}

/**
 * Define a function to handle this sub-set of events, and filter down to the data you're interested in
 */
function onUserDataEvent(data: WsUserDataEvents) {
  // Filter down to only futures user data with a type guard
  if (isWsFormattedFuturesUserDataEvent(data)) {
    switch (data.eventType) {
      case 'ACCOUNT_UPDATE': {
        onAccountUpdate(data);
        return;
      }
      // not interested in these events, they dont include balance updates
      case 'ORDER_TRADE_UPDATE':
        return;
      default: {
        console.log(
          new Date(),
          'usdm user data event: ',
          JSON.stringify(data, null, 2),
        );
      }
    }
    return;
  }
}

/** Log balance updates when account changes happen */
function onAccountUpdate(data: WsMessageFuturesUserDataAccountUpdateFormatted) {
  // Extract the USDT balance, from an array of balances
  const baseBalanceSymbol = 'USDT';
  const updatedBalance = data.updateData.updatedBalances.find(
    (bal) => bal.asset === baseBalanceSymbol,
  );

  if (!updatedBalance) {
    console.error(
      new Date(),
      `Failed to find ${baseBalanceSymbol} balance in ws update: ${JSON.stringify(
        data,
      )}`,
    );
    return;
  }

  console.log(
    new Date(),
    `Balance updated to ${updatedBalance.walletBalance} USDT`,
  );
}
