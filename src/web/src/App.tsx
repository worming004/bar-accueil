import React from 'react';
import {Counter} from './features/counter/Counter';
import {store} from "./app/store";
import './App.css';
import {data} from "./features/counter/fillStoreFromJson";

function App() {
    store.dispatch(data())

    return (
        <div className="App">
            <Counter/>
        </div>
    );
}

export default App;
