import { Provider } from "react-redux";
import store from "./redux/store";
import NavContainer from "./screens/NavContainer";

export default function App() {
  return (
    <Provider store={store}>
      <NavContainer />
    </Provider>
  );
}
