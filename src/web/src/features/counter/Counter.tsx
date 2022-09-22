import React from 'react';

import {InputPage} from "./inputs/InputPage";
import {OutputPage} from "./outputs/OutputPage";

export function Counter() {
    const inputStyle = {maxWidth: "75%"}
    const outputStyle = {maxWidth: "25%"}

    return (
        <div className="flex flex-wrap">
            <div style={inputStyle} className="border-r-8 border-yellow-700">
                <InputPage></InputPage>
            </div>
            <div style={outputStyle} >
                <OutputPage></OutputPage>
            </div>
        </div>
    );
}
