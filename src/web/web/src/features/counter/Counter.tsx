import React from 'react';

import {useAppSelector} from '../../app/hooks';
import {
    selectPresentationItems, selectPresentation,
} from './counterSlice';
import styles from './Counter.module.css';
import {InputPage} from "./inputs/InputPage";
import {OutputPage} from "./outputs/OutputPage";

export function Counter() {
    const items = useAppSelector(selectPresentationItems);
    const presentation = useAppSelector(selectPresentation)

    return (
        <div>
            <InputPage></InputPage>
            <OutputPage></OutputPage>
            <div className={styles.row}>
                {JSON.stringify(items)}
                <br/>
                {JSON.stringify(presentation)}
            </div>
            <div className={styles.row}>

            </div>
        </div>
    );
}
