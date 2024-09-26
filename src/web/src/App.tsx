import { Counter } from './features/counter/Counter';
import { store } from "./app/store";
import './App.css';
import { data } from "./features/counter/fillStoreFromJson";
import HeaderApp from './features/header/headerApp';
import { useAppSelector } from './app/hooks';
import { selectFeatureFlag } from './features/counter/counterSlice';

function App() {
  store.dispatch(data())
  const featureFlags = useAppSelector(selectFeatureFlag)
  const header = !!featureFlags?.useBackend ? <HeaderApp></HeaderApp> : <></>
  return (
    <div className="App">
      {header}
      <Counter />
    </div>
  );
}

export default App;
