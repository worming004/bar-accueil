import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectItems,
} from './counterSlice';
import styles from './Counter.module.css';

export function Counter() {
  const count = useAppSelector(selectItems);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className={styles.row}>

      </div>
      <div className={styles.row}>

      </div>
    </div>
  );
}
