import { SpotClient } from 'bybit-api';

const client = new SpotClient();

/**
 * Simple script to log latency estimates for making an API call to bybit's time endpoint
 */
async function start() {
  const clientTimeReqStart = Date.now();
  const serverTime = await client.getServerTime();
  const clientTimeReqEnd = Date.now();

  console.log('time: ', {
    // Time the request was made
    clientTimeReqStart,
    // Time the response was received
    clientTimeReqEnd,
    // Estimate for how long it took to make an API call to the time endpoint and to get a reply
    clientTimeReqDiff: clientTimeReqEnd - clientTimeReqStart,
    // Time returned by the server
    serverTime,
    // Estimated latency from request start time to server reply
    serverTimeStartDiff: serverTime - clientTimeReqStart,
    // Estimated latency from server reply to reply received
    serverTimeEndDiff: clientTimeReqEnd - serverTime,
  });

  process.exit(0);
}

start();
