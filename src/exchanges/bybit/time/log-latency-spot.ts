import { RestClientV5 } from 'bybit-api';

const client = new RestClientV5();

/**
 * Simple script to log latency estimates for making an API call to bybit's time endpoint
 */
async function start() {
  const clientTimeReqStart = Date.now();
  const serverTime = await client.getServerTime();
  console.log('serverTime: ', serverTime);
  const clientTimeReqEnd = Date.now();

  const serverTimeMs = serverTime.time;

  console.log('time: ', {
    // Time the request was made
    clientTimeReqStart,
    // Time the response was received
    clientTimeReqEnd,
    // Estimate for how long it took to make an API call to the time endpoint and to get a reply
    clientTimeReqDiff: clientTimeReqEnd - clientTimeReqStart,
    // Time returned by the server
    serverTimeMs,
    // Estimated latency from request start time to server reply
    serverTimeStartDiff: serverTimeMs - clientTimeReqStart,
    // Estimated latency from server reply to reply received
    serverTimeEndDiff: clientTimeReqEnd - serverTimeMs,
  });

  process.exit(0);
}

start();
