import { WebsocketClient } from 'bitget-api';
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
const ws = new WebsocketClient({});

interface BitgetOrderBookLevel {
  asks: [string, string][];
  bids: [string, string][];
  ts: number;
}

interface BitgetMessageArg {
  instId: string;
}

interface BitgetWsMessage {
  action: 'snapshot' | 'update';
  arg: BitgetMessageArg;
  data: BitgetOrderBookLevel[];
}

ws.on('update', (message: BitgetWsMessage) => {
  return handleOrderbookUpdate(message);
});

// Futures
ws.subscribeTopic('MC', 'books', 'BTCUSDT');

function handleOrderbookUpdate(message: BitgetWsMessage): void {
  const { action, arg, data } = message;
  const { instId } = arg;
  const [update] = data;
  console.log(`Handling ${action} for ${instId}`);

  if (action === 'snapshot') {
    const asks = mapOrderBookLevels(instId, update.asks, 'Sell');
    const bids = mapOrderBookLevels(instId, update.bids, 'Buy');

    // Sort by side (Sell/Buy) and then by price
    const combined: OrderBookLevelState[] = [...asks, ...bids].sort(
      (a, b) =>
        a[2].localeCompare(b[2]) ||
        (a[2] === 'Sell' ? b[1] - a[1] : a[1] - b[1]),
    );

    // Type assertion needed due to library type definition issue - handleSnapshot expects OrderBookLevelState[] but TypeScript infers incorrectly
    OrderBooks.handleSnapshot(
      instId,
      combined as Parameters<typeof OrderBooks.handleSnapshot>[1],
      update.ts / 1000,
    ).print();
  } else if (action === 'update') {
    const asks = mapOrderBookLevels(instId, update.asks, 'Sell');
    const bids = mapOrderBookLevels(instId, update.bids, 'Buy');

    // Sort by side (Sell/Buy) and then by price
    const combined: OrderBookLevelState[] = [...asks, ...bids].sort(
      (a, b) =>
        a[2].localeCompare(b[2]) ||
        (a[2] === 'Sell' ? b[1] - a[1] : a[1] - b[1]),
    );

    OrderBooks.handleDelta(instId, [], combined, [], update.ts / 1000).print();
  }
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
