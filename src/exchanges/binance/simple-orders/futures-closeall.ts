import { NewFuturesOrderParams, RestClientOptions, USDMClient } from 'binance';

(async () => {
  const key = process.env.APIKEY || 'APIKEY';
  const secret = process.env.APISECRET || 'APISECRET';

  const binanceFuturesConfig: RestClientOptions = {
    api_key: key,
    api_secret: secret,
    beautifyResponses: true,
  };

  const binanceRest = new USDMClient(binanceFuturesConfig);

  const positions = await binanceRest.getPositions();
  const activePositions = positions.filter(
    (pos) => Number(pos.positionAmt) !== 0,
  );

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
})();
