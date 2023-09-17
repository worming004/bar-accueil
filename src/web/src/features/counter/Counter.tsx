import React from 'react';

import { InputPage } from "./inputs/InputPage";
import { OutputPage } from "./outputs/OutputPage";
import { ReturnPage } from './return/ReturnPage';
import Modal from 'react-modal'
import { useAppSelector } from '../../app/hooks';
import { selectPresentationMode, tokenMode } from './counterSlice';
import { store } from '../../app/store';

export function Counter() {
  const inputStyle = { maxWidth: "75%" }
  const modalStyle = { content: { maxWidth: "65%" } }
  const outputStyle = { maxWidth: "25%" }

  const presentationMode = useAppSelector(selectPresentationMode);
  const toTokenModeClick = () => store.dispatch(tokenMode());

  return (
    <div className="flex flex-wrap">
      <div style={inputStyle} className="border-r-8 border-yellow-700">
        <InputPage></InputPage>
        <Modal
          isOpen={presentationMode === 'Payment'}
          style={modalStyle}
          onRequestClose={() => toTokenModeClick()}
        >
          <ReturnPage></ReturnPage>
        </Modal>
      </div>
      <div style={outputStyle} >
        <OutputPage></OutputPage>
      </div>
    </div>
  );
}
