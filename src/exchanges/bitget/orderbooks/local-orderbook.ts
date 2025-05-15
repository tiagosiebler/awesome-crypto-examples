import { WebsocketClient } from 'bitget-api';
import { OrderBooksStore } from 'orderbooks';

const OrderBooks = new OrderBooksStore({
  traceLog: true,
  checkTimestamps: false,
});

// connect to a websocket and relay orderbook events to handlers
const ws = new WebsocketClient({});

ws.on('update', (message) => {  
  return handleOrderbookUpdate(message);
});

// Futures
ws.subscribeTopic('MC', 'books', 'BTCUSDT');

function handleOrderbookUpdate(message) {      
  const { action, arg, data } = message;      
  const { instId } = arg;      
  const [update] = data;      
  console.log(`Handling ${action} for ${instId}`);      
    
  if (action === 'snapshot') {     
    const asks = update.asks.map(level => mapBitget(instId, level, 'Sell'));    
    const bids = update.bids.map(level => mapBitget(instId, level, 'Buy'));    
    
    // Sort by side (Sell/Buy) and then by price    
    const combined = asks.concat(bids).sort((a, b) => a[2].localeCompare(b[2]) || (a[2] === 'Sell' ? b[1] - a[1] : a[1] - b[1]));    
    
    OrderBooks.handleSnapshot(instId, combined, update.ts / 1000).print();      
  }      
  else if (action === 'update') {    
    const asks = update.asks.map(level => mapBitget(instId, level, 'Sell'));    
    const bids = update.bids.map(level => mapBitget(instId, level, 'Buy'));    
    
    // Sort by side (Sell/Buy) and then by price    
    const combined = asks.concat(bids).sort((a, b) => a[2].localeCompare(b[2]) || (a[2] === 'Sell' ? b[1] - a[1] : a[1] - b[1]));    
    
    OrderBooks.handleDelta(instId, [], combined, [], update.ts / 1000).print();      
  }      
}      
    
// Function to map a level to a new format
function mapBitget(instId, level, side) {          
  return [instId, level[0], side, level[1], undefined];        
}     
