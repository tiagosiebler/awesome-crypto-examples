import { isWsTradesEvent, WebsocketClient } from 'ftx-api';

const key = process.env.APIKEY || 'APIKEY';
const secret = process.env.APISECRET || 'APISECRET';

try {
  const params = {
    key: key,
    secret: secret,
    // subAccountName: 'sub1',
  };

  // Prepare a ws connection (connection init is automatic once ws client is instanced)
  const ws = new WebsocketClient(params);

  // append event listeners
  ws.on('response', (msg) => console.log('response: ', msg));
  ws.on('update', (msg) => {
    // use a type guard to narrow down types
    if (isWsTradesEvent(msg)) {
      // msg now is WsEventTrades
      console.log('trades event: ', msg);
    } else {
      console.log('update: ', msg);
    }
  });
  ws.on('error', (msg) => console.log('err: ', msg));

  // Subscribe to private topics
  // Topics documented here: https://docs.ftx.com/#private-channels
  ws.subscribe(['fills', 'orders']);
} catch (e) {
  console.error('err: ', e.body);
}
