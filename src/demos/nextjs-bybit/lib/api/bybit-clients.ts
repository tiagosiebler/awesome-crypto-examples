import {RestClientV5, WebsocketClient} from "bybit-api";

export const restClient = new RestClientV5({
    demoTrading: true,
    keepAlive: true,
});

export const socketClient = new WebsocketClient({
    demoTrading: true,
})