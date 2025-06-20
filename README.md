# Awesome crypto examples

[![Build & Test](https://github.com/tiagosiebler/awesome-crypto-examples/actions/workflows/build.yml/badge.svg)](https://github.com/tiagosiebler/awesome-crypto-examples/actions/workflows/test.yml)
[![last commit](https://img.shields.io/github/last-commit/tiagosiebler/awesome-crypto-examples)](https://github.com/tiagosiebler/awesome-crypto-examples)
[![Telegram](https://img.shields.io/badge/chat-on%20telegram-blue.svg)](https://t.me/nodetraders)

Wondering how to "[insert something crypto & nodejs related]"? Welcome to a loose collection of node.js examples and demos in the world of algo trading (especially cryptocurrencies).

What kind of examples?

- Working with crypto exchange REST APIs
- Working with crypto exchange WebSocket streams
- Anything else crypto + node.js?

Note: these are not meant to suggest best practices. These are purely demonstrations for one (or more) way(s) for doing various things.

## Getting started

All examples are in node.js and/or typescript.

- Ensure you have node.js installed (see `.nvmrc` for the recommended version (or above))
- Install dependencies: `npm install`

### Frequenty Asked Questions

Check out the wiki. Contributions welcome:
https://github.com/tiagosiebler/awesome-crypto-examples/wiki

### Running examples (node.js)

Node.js examples will be any file that ends with `.js`. If the example has a readme, refer to the readme for specific instructions, otherwise use the following command to run the example with node.js:

```bash
node src/path/to/example.js
```

### Running examples (typescript)

Typescript examples will be any file that ends with `.ts`. If the example has a readme, refer to the readme for specific instructions, otherwise use the following command to run the example with typescript's ts-node:

```bash
npx ts-node src/path/to/example.ts
```

Refer to the following documentation for guidance on ts-node: https://www.npmjs.com/package/ts-node#overview

### Providing API keys

Some examples make private API calls (e.g. the [account monitoring](https://github.com/tiagosiebler/awesome-crypto-examples/blob/master/src/exchanges/binance/account-events/log-account-events.ts#L9-L10) ones). These rely on API credentials to make signed API calls to your account.

Either locally download a copy of this repo and edit the values directly, or provide these as environmental variables. If a sample has the following process.env snippet:

```
const key = process.env.APIKEY || 'APIKEY';
const secret = process.env.APISECRET || 'APISECRET';
```

You can provide your API credentials (in unix & macOS environments) when executing the sample:

```bash
APIKEY="yourkeyhere" APISECRET="yoursecrethere" npx ts-node src/exchanges/binance/account-events/log-account-events.ts
```

## Contributing

PRs for various concepts welcome. Typescript preferred, but plain javascript is also OK.

- Not sure what to add?
  - What would've helped you when you were first getting started?
- How big can a demonstration be?
  - If it's useful & reasonable for others to learn from, as big as you want!
- Stuck on a problem and looking for a related sample?
  - Use the issues tab or join the [node.js algo traders telegram community](https://t.me/nodetraders)!

<!-- template_contributions -->

## Contributions & Thanks

Have my projects helped you? Share the love, there are many ways you can show your thanks:

- Star & share my projects.
- Are my projects useful? Sponsor me on Github and support my effort to maintain & improve them: https://github.com/sponsors/tiagosiebler
- Have an interesting project? Get in touch & invite me to it.
- Or buy me all the coffee:
  - ETH(ERC20): `0xA3Bda8BecaB4DCdA539Dc16F9C54a592553Be06C` <!-- metamask -->

<!-- template_contributions_end -->

### Contributions & Pull Requests

Contributions are encouraged, I will review any incoming pull requests. See the issues tab for todo items.

<!-- template_related_projects -->

## Related projects

Check out my related JavaScript/TypeScript/Node.js projects:

- Try my REST API & WebSocket SDKs:
  - [Bybit-api Node.js SDK](https://www.npmjs.com/package/bybit-api)
  - [Okx-api Node.js SDK](https://www.npmjs.com/package/okx-api)
  - [Binance Node.js SDK](https://www.npmjs.com/package/binance)
  - [Gateio-api Node.js SDK](https://www.npmjs.com/package/gateio-api)
  - [Bitget-api Node.js SDK](https://www.npmjs.com/package/bitget-api)
  - [Kucoin-api Node.js SDK](https://www.npmjs.com/package/kucoin-api)
  - [Coinbase-api Node.js SDK](https://www.npmjs.com/package/coinbase-api)
  - [Bitmart-api Node.js SDK](https://www.npmjs.com/package/bitmart-api)
- Try my misc utilities:
  - [OrderBooks Node.js](https://www.npmjs.com/package/orderbooks)
  - [Crypto Exchange Account State Cache](https://www.npmjs.com/package/accountstate)
- Check out my examples:
  - [awesome-crypto-examples Node.js](https://github.com/tiagosiebler/awesome-crypto-examples)
  <!-- template_related_projects_end -->

<!-- template_star_history -->

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=tiagosiebler/bybit-api,tiagosiebler/okx-api,tiagosiebler/binance,tiagosiebler/bitget-api,tiagosiebler/bitmart-api,tiagosiebler/gateio-api,tiagosiebler/kucoin-api,tiagosiebler/coinbase-api,tiagosiebler/orderbooks,tiagosiebler/accountstate,tiagosiebler/awesome-crypto-examples&type=Date)](https://star-history.com/#tiagosiebler/bybit-api&tiagosiebler/okx-api&tiagosiebler/binance&tiagosiebler/bitget-api&tiagosiebler/bitmart-api&tiagosiebler/gateio-api&tiagosiebler/kucoin-api&tiagosiebler/coinbase-api&tiagosiebler/orderbooks&tiagosiebler/accountstate&tiagosiebler/awesome-crypto-examples&Date)

<!-- template_star_history_end -->
