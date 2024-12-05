// Import futures client at the top
import { RestClientV5 } from 'bybit-api';

// initialise the futures client - bybit uses same client for spot and futures
// it is all unified in V5
const client = new RestClientV5({
  key: 'insert api key here',
  secret: 'insert api secret here',
});
