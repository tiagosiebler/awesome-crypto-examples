import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
