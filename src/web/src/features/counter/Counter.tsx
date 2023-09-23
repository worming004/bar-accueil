import React from 'react';

import { InputPage } from "./inputs/InputPage";
import { OutputPage } from "./outputs/OutputPage";
import { ReturnPage } from './return/ReturnPage';
import Modal from 'react-modal'
import { useAppSelector } from '../../app/hooks';
import { selectPresentationItems, selectPresentationMode, tokenMode } from './counterSlice';
import { store } from '../../app/store';

export function Counter() {
  const inputStyle = { maxWidth: "72%" }
  const modalStyle = { content: { maxWidth: "65%" }, overlay: { backgroundColor: 'rgba(255, 255, 255, 0.30)' } }
  const outputStyle = { maxWidth: "28%" }

  const presentationMode = useAppSelector(selectPresentationMode);
  const inputs = useAppSelector(selectPresentationItems).length;
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
      {inputs === 0 ?
        <div >
          Si vous voyez ce message, c'est qu'un bug non résolu est apparu. Pour le résoudre, il vous suffit de connecter la tablette à internet via 4g, et de recharger la page. Pour recharger, faites un glissement de doigt de haut en bas.
        </div>
        : ''}
    </div>
  );
}
