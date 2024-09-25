import { Counter } from './features/counter/Counter';
import { store } from "./app/store";
import './App.css';
import { data } from "./features/counter/fillStoreFromJson";
import { useAppSelector } from './app/hooks';
import { selectUserIsAuthenticated } from './features/counter/counterSlice';
import HeaderApp from './features/header/headerApp';

function App() {
  store.dispatch(data())

  const userIsAuthenticated = useAppSelector(selectUserIsAuthenticated);

  return (
    <div className="App">
      <HeaderApp userIsAuthenticated={userIsAuthenticated}></HeaderApp>
      <Counter />
    </div>
  );
}

export default App;
