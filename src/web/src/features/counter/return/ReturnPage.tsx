import { KeyboardEvent } from "react";
import { useAppSelector } from "../../../app/hooks";
import { store } from "../../../app/store";
import { getBufferByEnv } from "../../buffer/buffer";
import { buildCash, buildElectronique } from "../../buffer/command";
import { resetSelection, selectPresentationAmount, tokenMode, amountReceived, selectAmountToGiveBack, selectPresentationAmountReceived, resetAmountReceived, selectFeatureFlag, selectItemWithCount } from "../counterSlice";

export function ReturnPage() {
  const items = useAppSelector(selectItemWithCount);
  const featureFlags = useAppSelector(selectFeatureFlag)
  const buffer = getBufferByEnv();
  const amountToPay = useAppSelector(selectPresentationAmount);
  const amountReceivedValue = useAppSelector(selectPresentationAmountReceived);
  const toGiveBack = useAppSelector(selectAmountToGiveBack)
  const style = {
    fontSize: "35px",
  }
  const controlClasses = "border-4 m-5 p-4 left-0"
  const isWarning = toGiveBack < 0;
  const retourColor = isWarning ? { color: "red" } : {};

  const toTokenModeClick = () => store.dispatch(tokenMode());
  const executePaiementCash = () => {
    if (featureFlags?.useBackend) {
      buffer.addCommand(buildCash(items, amountReceivedValue, toGiveBack, amountToPay));
    }
    resetAndToTokenMode()
  }
  const executePaiementElectronique = () => {
    if (featureFlags?.useBackend) {
      buffer.addCommand(buildElectronique(items, amountToPay));
    }
    resetAndToTokenMode()
  }
  const resetAndToTokenMode = () => {
    store.dispatch(resetSelection());
    store.dispatch(resetAmountReceived());
    store.dispatch(tokenMode());
  }
  const valueReceivedHandler = (val: React.ChangeEvent<HTMLInputElement>) => {
    store.dispatch(amountReceived(+val.target.value))
  }

  const blurIfEnter = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      const elem = evt.target as any;
      elem.blur();
    }
  }
  return (
    <>
      <span className='text-4xl'>Montant: </span>
      <span className='text-4xl'>{amountToPay.toFixed(2)}€</span>
      <br />
      <label htmlFor="recu" className='text-4xl'>Reçu: </label>
      <input type='number' step=".01" id='recu' className={controlClasses} onKeyUp={(evt) => { blurIfEnter(evt) }} onChange={(evt) => { valueReceivedHandler(evt) }} defaultValue={amountReceivedValue}></input>
      <br />
      <span className='text-4xl'>Retour: </span>
      <div><span className='text-4xl' style={retourColor}>{toGiveBack.toFixed(2)}€</span></div>
      <button className={controlClasses} style={style} onClick={() => { executePaiementCash() }}>Valider le paiement</button>
      <button className={controlClasses} style={style} onClick={() => { executePaiementElectronique() }}>Paiement electronique</button>
      <button className={controlClasses} style={style} onClick={() => { toTokenModeClick() }}>Modifier la commande</button>
    </>
  )
}

