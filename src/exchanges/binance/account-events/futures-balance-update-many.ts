/**
 *
 * Similar to "futures-balance-update", although this workflow monitors balance updates for several accounts in one process, using an account label as a key
 *
 */

import {
  isWsFormattedFuturesUserDataEvent,
  WebsocketClient,
  WsMessageFuturesUserDataAccountUpdateFormatted,
} from 'binance';

type AccountLabel = string;
interface BinanceAccount {
  key: string;
  secret: string;
  /** Some kind of descriptor on this account, preferably just one word */
  label: AccountLabel;
}

/**
 * A list of accounts to subscribe to.
 *
 * Warning: for simple demo purposes the api credentials are hardcoded here, but in a real scenario never post your API credentails to git!
 */
const ACCOUNTS: BinanceAccount[] = [
  {
    key: '123123123',
    secret: '123123123',
    label: 'acc1',
  },
  {
    key: '123123123',
    secret: '123123123',
    label: 'acc2',
  },
];

// Optional, store a ws client per account
const wsClientStore: Record<AccountLabel, WebsocketClient> = {};

ACCOUNTS.forEach((account) => {
  const wsClient = new WebsocketClient({
    api_key: account.key,
    api_secret: account.secret,
    beautify: true,
  });

  const accountLabel = account.label;
  wsClientStore[accountLabel] = wsClient;

  wsClient.on('formattedUserDataMessage', (data) => {
    if (
      isWsFormattedFuturesUserDataEvent(data) &&
      data.eventType === 'ACCOUNT_UPDATE'
    ) {
      onAccountUpdate(data, accountLabel);
    }
  });
  wsClient.on('error', (data) => {
    console.log(new Date(), `Error on account ${accountLabel}`, data);
  });
  wsClient.on('open', () => {
    console.log(new Date(), `Connected to account ${accountLabel}`);
  });

  try {
    wsClient.subscribeUsdFuturesUserDataStream();
  } catch (e) {
    console.error(
      new Date(),
      `Exception connecting to account ${accountLabel}`,
      e,
    );
  }
});

/** Log balance updates when account changes happen */
async function onAccountUpdate(
  data: WsMessageFuturesUserDataAccountUpdateFormatted,
  accountLabel: AccountLabel,
) {
  const baseBalanceSymbol = 'USDT';
  const updatedBalance = data.updateData.updatedBalances.find(
    (bal) => bal.asset === baseBalanceSymbol,
  );
  if (!updatedBalance) {
    console.error(
      new Date(),
      `Failed to find ${baseBalanceSymbol} balance in ws update: ${JSON.stringify(
        data,
      )}`,
    );
    return;
  }

  console.log(
    new Date(),
    `Balance updated for "${accountLabel}" to ${updatedBalance.walletBalance} USDT`,
  );
}
