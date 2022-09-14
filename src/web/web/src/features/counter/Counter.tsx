import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    addItem, addItemsByBatch,
    selectItems, selectPresentation,
} from './counterSlice';
import styles from './Counter.module.css';

export function Counter() {
  const items = useAppSelector(selectItems);
  const presentation = useAppSelector(selectPresentation)

  return (
    <div>
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
