import React, { useState, useEffect } from "react";
import { RestClientV5 } from "bybit-api";
import CryptoJS from "crypto-js";

const SECRET_PASS: string = "SuperSecretKey"; // Change this in production

const BybitDemo: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [apiSecret, setApiSecret] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("");
  const [category, setCategory] = useState<string>("linear");
  const [symbol, setSymbol] = useState<string>("BTCUSDT");
  const [orderQty, setOrderQty] = useState<string>("0.01");
  const [orderPrice, setOrderPrice] = useState<string>("20000");
  const [accountType, setAccountType] = useState<string>("UNIFIED");
  const [side, setSide] = useState<string>("Buy");
  const [testnet, setTestnet] = useState<boolean>(false);

  const encryptData = (data: string): string =>
    CryptoJS.AES.encrypt(data, SECRET_PASS).toString();
  const decryptData = (encryptedData: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_PASS);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return "";
    }
  };

  useEffect(() => {
    const storedApiKey = localStorage.getItem("apiKey");
    const storedApiSecret = localStorage.getItem("apiSecret");

    if (storedApiKey && storedApiSecret) {
      setApiKey(decryptData(storedApiKey));
      setApiSecret(decryptData(storedApiSecret));
    }
  }, []);

  useEffect(() => {
    if (apiKey && apiSecret) {
      localStorage.setItem("apiKey", encryptData(apiKey));
      localStorage.setItem("apiSecret", encryptData(apiSecret));
    }
  }, [apiKey, apiSecret]);

  const handleLogout = (): void => {
    localStorage.removeItem("apiKey");
    localStorage.removeItem("apiSecret");
    setApiKey("");
    setApiSecret("");
    setResponse("Logged out and keys cleared!");
  };

  const handleApiCall = async (): Promise<void> => {
    setShowModal(false);

    if (!apiKey || !apiSecret) {
      setResponse("Please enter API Key and Secret!");
      return;
    }

    setLoading(true);
    try {
      const client = new RestClientV5({
        key: apiKey,
        secret: apiSecret,
        testnet,
      });

      let result;
      if (actionType === "getOrders") {
        result = await client.getActiveOrders({ category, symbol });
      } else if (actionType === "getBalance") {
        result = await client.getWalletBalance({ accountType });
      } else if (actionType === "placeOrder") {
        result = await client.submitOrder({
          category,
          symbol,
          side,
          orderType: "Limit",
          qty: orderQty,
          price: orderPrice,
          timeInForce: "GTC",
        });
      } else if (actionType === "fetchMarketData") {
        result = await client.getOrderbook({ category, symbol });
      }
      setResponse(JSON.stringify(result, null, 2));
    } catch (error: any) {
      console.log(error);
      setResponse(`Error: ${error.message ? error.message : error.code}`);
    }
    setLoading(false);
  };

  const openModal = (action: string): void => {
    setActionType(action);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Bybit API Demo</h2>

      <div className="d-flex align-items-center gap-3">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="mainnetCheckbox"
            checked={!testnet}
            onChange={() => setTestnet(false)}
          />
          <label className="form-check-label" htmlFor="mainnetCheckbox">
            Mainnet
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="testnetCheckbox"
            checked={testnet}
            onChange={() => setTestnet(true)}
          />
          <label className="form-check-label" htmlFor="testnetCheckbox">
            Testnet
          </label>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">API Key</label>
        <input
          type="text"
          className="form-control"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">API Secret</label>
        <input
          type="password"
          className="form-control"
          value={apiSecret}
          onChange={(e) => setApiSecret(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <button
          className="btn btn-primary me-2"
          onClick={() => openModal("getOrders")}
          disabled={loading}
        >
          Get Active Orders
        </button>
        <button
          className="btn btn-secondary me-2"
          onClick={() => openModal("getBalance")}
          disabled={loading}
        >
          Get Wallet Balance
        </button>
        <button
          className="btn btn-info me-2"
          onClick={() => openModal("fetchMarketData")}
          disabled={loading}
        >
          Get Order Book
        </button>
        <button
          className="btn btn-success me-2"
          onClick={() => openModal("placeOrder")}
          disabled={loading}
        >
          Place Order
        </button>
        <button
          className="btn btn-danger"
          onClick={handleLogout}
          disabled={loading}
        >
          Logout & Clear Keys
        </button>
      </div>

      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050 }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="mt-3">
        <label className="form-label">API Response</label>
        <textarea
          className="form-control"
          rows="10"
          readOnly
          value={response}
        ></textarea>
      </div>

      <div
        className="modal fade show"
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Enter Parameters</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {/* Wallet Balance */}
              {actionType === "getBalance" && (
                <>
                  <label className="form-label">Account Type</label>
                  <select
                    className="form-select"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                  >
                    <option value="UNIFIED">Unified</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="SPOT">Spot</option>
                    <option value="INVESTMENT">Investment</option>
                  </select>
                </>
              )}

              {/* Active Orders, Market Data, and Order Placement */}
              {["getOrders", "fetchMarketData", "placeOrder"].includes(
                actionType
              ) && (
                <>
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="linear">Linear (USDT-Margined)</option>
                    <option value="inverse">Inverse (Coin-Margined)</option>
                    <option value="spot">Spot Trading</option>
                    <option value="option">Options Trading</option>
                  </select>

                  <label className="form-label">Symbol</label>
                  <select
                    className="form-select"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                  >
                    <option value="BTCUSDT">BTC/USDT</option>
                    <option value="ETHUSDT">ETH/USDT</option>
                    <option value="XRPUSDT">XRP/USDT</option>
                  </select>
                </>
              )}

              {/* Place Order Parameters */}
              {actionType === "placeOrder" && (
                <>
                  <label className="form-label">Side</label>
                  <select
                    className="form-select"
                    value={side}
                    onChange={(e) => setSide(e.target.value)}
                  >
                    <option value="Buy">Buy</option>
                    <option value="Sell">Sell</option>
                  </select>

                  <label className="form-label">Order Quantity</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Quantity"
                    value={orderQty}
                    onChange={(e) => setOrderQty(e.target.value)}
                  />

                  <label className="form-label">
                    Price (Required for Limit Orders)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Price"
                    value={orderPrice}
                    onChange={(e) => setOrderPrice(e.target.value)}
                  />
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleApiCall}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BybitDemo;
