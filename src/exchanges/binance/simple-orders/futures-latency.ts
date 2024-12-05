import { NewFuturesOrderParams, RestClientOptions, USDMClient } from 'binance';

function logResultLatency(orderBeforeDt: Date, result: unknown, desc: string) {
  const orderAfterDt = new Date();
  console.log(
    `Latency for (${desc}): `,
    JSON.stringify(
      {
        orderBeforeDt,
        orderAfterDt,
        orderRoundtripMs: orderAfterDt.getTime() - orderBeforeDt.getTime(),
        result,
      },
      null,
      2,
    ),
  );
}

/**
 *
 * Very simple test to open an order via REST and measure roundtrip latency
 *
 */

(async () => {
  try {
    const key = process.env.APIKEY || 'APIKEY';
    const secret = process.env.APISECRET || 'APISECRET';

    const binanceFuturesConfig: RestClientOptions = {
      api_key: key,
      api_secret: secret,
      beautifyResponses: true,
    };

    const binanceRest = new USDMClient(binanceFuturesConfig);

    const targetSymbol = 'LTCUSDT';
    const orderQuantity = 0.275;

    // Note: this assumes the account is trading in one-way mode!
    const orderAck: NewFuturesOrderParams = {
      side: 'BUY',
      quantity: orderQuantity,
      symbol: targetSymbol,
      type: 'MARKET',
      newOrderRespType: 'ACK',
    };

    const orderAckBeforeDt = new Date();
    const orderAckRes = await binanceRest.submitNewOrder(orderAck);
    logResultLatency(orderAckBeforeDt, orderAckRes, 'order ACK');

    const orderResultBeforeDt = new Date();
    const orderResult = await binanceRest.submitNewOrder({
      ...orderAck,
      newOrderRespType: 'RESULT',
    });
    logResultLatency(orderResultBeforeDt, orderResult, 'order RESULT');

    const orderFullBeforeDt = new Date();
    const orderFull = await binanceRest.submitNewOrder({
      ...orderAck,
      newOrderRespType: 'FULL',
    });
    logResultLatency(orderFullBeforeDt, orderFull, 'order FULL');

    console.log(`Fetching positions...`);
    const positions = await binanceRest.getPositions();
    const activePositions = positions.filter(
      (pos) => Number(pos.positionAmt) !== 0,
    );

    console.log(`Closing positions...`);
    for (const pos of activePositions) {
      try {
        const qty = Number(pos.positionAmt);

        // Note: this assumes the account is trading in one-way mode!
        const order: NewFuturesOrderParams = {
          side: qty > 0 ? 'SELL' : 'BUY',
          quantity: Math.abs(qty),
          symbol: pos.symbol,
          type: 'MARKET',
        };

        console.log(`Submitting close order: `, JSON.stringify(order, null, 2));

        const res = await binanceRest.submitNewOrder(order);
        console.log(`Executed close for ${pos.symbol}. Result: `, res);
      } catch (e) {
        console.error(
          `Exception closing ${pos.symbol} ${pos.positionSide} position`,
          e,
        );
      }
    }

    console.log('Done!');
  } catch (e) {
    console.error(new Date(), `Exception: `, e);
  }
})();
