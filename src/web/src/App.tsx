import { Counter } from './features/counter/Counter';
import { store } from "./app/store";
import './App.css';
import { data } from "./features/counter/fillStoreFromJson";
import HeaderApp from './features/header/headerApp';

function App() {
  store.dispatch(data())

  return (
    <div className="App">
      <HeaderApp></HeaderApp>
      <Counter />
    </div>
  );
}

export default App;
