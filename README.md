# awesome-crypto-examples

Wondering how to "[insert something crypto & nodejs related]"? Welcome to a loose collection of node.js examples and demos.

What kind of examples?
- Working with REST APIs
- Working with WebSockets
- Anything else crypto + node.js?

Note: these are not meant to suggest best practices. These are purely demonstrations for one (or more) way(s) for doing various things.

## Getting started
All examples are in node.js and/or typescript.
- Ensure you have node.js installed (see `.nvmrc` for the recommended version (or above))
- Install dependencies: `npm install`

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

Refer to the following documentation for guidance on ts-node: https://www.npmjs.com/package/ts-node#installation

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
