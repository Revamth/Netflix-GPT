// Root component: provides the Redux store to the whole app and renders the router.
import Body from "./components/Body";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";

function App() {
  return <Provider store={appStore}>{<Body />}</Provider>;
}

export default App;
