import React from 'react';

import {useAppSelector} from '../../app/hooks';
import {
    selectItems, selectPresentation,
} from './counterSlice';
import styles from './Counter.module.css';
import {InputPage} from "./inputs/InputPage";

export function Counter() {
    const items = useAppSelector(selectItems);
    const presentation = useAppSelector(selectPresentation)

    return (
        <div>
            <InputPage></InputPage>
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
