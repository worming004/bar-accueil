import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import {store} from "./app/store";
import './App.css';
import {addItem, addItemsByBatch} from "./features/counter/counterSlice";
import {useAppDispatch} from "./app/hooks";
import {data} from "./features/counter/fillStoreFromJson";

function App() {
    store.dispatch(data())
    store.dispatch(addItem({name: "test", token: {name: 'token', value:3}}))

  return (
    <div className="App">
      <Counter/>
    </div>
  );
}

export default App;
