# Orders

Examples placing and managing orders with OKX (OKEX) APIs and WebSockets, written in typescript:
- `spot-order`: checking balance and placing spot market orders using the OKX REST API
  - TypeScript:
    `API_KEY_COM="yourapikey" API_SECRET_COM="yourapisecret" API_PASSPHRASE_COM="yourapipassphrase" ts-node examples/spot-order.ts`
  - JavaScript:
    `API_KEY_COM="yourapikey" API_SECRET_COM="yourapisecret" API_PASSPHRASE_COM="yourapipassphrase" node examples/spot-order.js`

If you don't have ts-node to execute the typescript samples, install it using npm: https://github.com/TypeStrong/ts-node#installation

These can also be converted to javascript by removing the types. See spot-order.ts/js as an example to compare.
