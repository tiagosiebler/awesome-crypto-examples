import { WebsocketClient } from 'bybit-api';
import {
  OrderBookLevel,
  OrderBookLevelState,
  OrderBooksStore,
} from 'orderbooks';

const OrderBooks = new OrderBooksStore({
  traceLog: true,
  checkTimestamps: false,
});

// connect to a websocket and relay orderbook events to handlers
const ws = new WebsocketClient({ testnet: false, market: 'v5' });

interface BybitBookLevel {
  s: string;
  b: [string, string][];
  a: [string, string][];
  u: string;
  seq: string;
  cts: string;
}

interface WsMessage {
  topic: string;
  type: string;
  ts: number;
  data: BybitBookLevel;
}
ws.on('update', (message: WsMessage) => {
  if (message.topic.toLowerCase().startsWith('orderbook')) {
    return handleOrderbookUpdate(message);
  }
});

ws.on('error', (error) => {
  console.error('ws error: ', error);
});

ws.subscribeV5('orderbook.50.BTCUSDT', 'linear');

// parse orderbook messages, detect snapshot vs delta, and format properties using OrderBookLevel
function handleOrderbookUpdate(message: WsMessage) {
  const { topic, type, ts, data } = message;
  const [topicKey, depth, symbol] = topic.split('.');


  // Use the new function for both bid and ask levels
  const levelsMapBid = mapOrderBookLevels(symbol, data.b, 'Buy');
  const levelsMapAsk = mapOrderBookLevels(symbol, data.a, 'Sell');

  //merge bid and ask levels into a single array
  const levels = [...levelsMapBid, ...levelsMapAsk];

  if (type === 'snapshot' ) {
    return OrderBooks.handleSnapshot(
      symbol,
      levels as Parameters<typeof OrderBooks.handleSnapshot>[1],
      // message,
    ).print();
  }

  if (type === 'delta') {
    const updateLevels: OrderBookLevelState[] = [];
    const deleteLevels: OrderBookLevelState[] = [];

    // Seperate "deletes" from "updates/inserts"
    levels.forEach((level) => {
      const [_symbol, _price, _side, qty] = level;

      if (qty === 0) {
        deleteLevels.push(level);
      } else {
        updateLevels.push(level);
      }
    });

    return OrderBooks.handleDelta(
      symbol,
      deleteLevels,
      updateLevels,
      [], // empty for inserting levels
      ts / 1000,
    ).print();
  }

  console.error('unhandled orderbook update type: ', type);
}

// Custom function to map order book levels to wanted format
function mapOrderBookLevels(
  symbol: string,
  levels: [string, string][],
  side: 'Buy' | 'Sell',
): OrderBookLevelState[] {
  return levels.map((level) => {
    return OrderBookLevel(symbol, +level[0], side, +level[1]);
  });
}
