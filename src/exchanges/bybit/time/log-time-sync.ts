import { RestClientV5 } from 'bybit-api';

const client = new RestClientV5();

/**
 * Script to check if local time is synced with exchange's server time and log latency estimates
 */
async function start() {
  const clientTimeReqStart = Date.now();
  const serverTime = await client.getServerTime();
  const clientTimeReqEnd = Date.now();

  const serverTimeMs = serverTime.time;
  const roundTripTime = clientTimeReqEnd - clientTimeReqStart;
  const estimatedOneWayLatency = Math.floor(roundTripTime / 2);

  // Adjust server time by adding estimated one-way latency
  const adjustedServerTime = serverTimeMs + estimatedOneWayLatency;

  // Calculate time difference between adjusted server time and local time
  const timeDifference = adjustedServerTime - clientTimeReqEnd;

  console.log('Time synchronization results:');
  console.log({
    localTime: clientTimeReqEnd,
    serverTime: serverTimeMs,
    roundTripTime,
    estimatedOneWayLatency,
    adjustedServerTime,
    timeDifference,
  });

  console.log(
    `Your approximate latency to exchange server: 
    One way: ${estimatedOneWayLatency}ms.
    Round trip: ${roundTripTime}ms.
    `,
  );

  if (timeDifference > 500) {
    console.warn(
      `WARNING! Time difference between server and client clock is greater than 500ms. It is currently ${timeDifference}ms.
      Consider adjusting your system clock to avoid unwanted clock sync errors!
      Visit https://github.com/tiagosiebler/awesome-crypto-examples/wiki/Timestamp-for-this-request-is-outside-of-the-recvWindow for more information`,
    );
  }
}

start();
