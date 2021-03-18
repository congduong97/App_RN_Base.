import React, {
  createContext,
  Fragment,
  useContext,
  useMemo,
  useRef,
  useEffect,
  useState,
  Alert,
} from "react";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { BaseDialog } from "./components";
const AppContext = createContext();

const objCheck = (thing) => {
  if ({}.toString.call(thing) !== "[object Object]") {
    throw "`useMergeState` only accepts objects.";
  }
  return thing;
};

export const useMergeState = (initialState = {}) => {
  const [stateScreen, setState] = useState(() => objCheck(initialState));

  const setStateScreen = (objOrFxn) => {
    setState((prevState) => {
      const newState = objCheck(
        objOrFxn instanceof Function ? objOrFxn(prevState) : objOrFxn
      );
      return { ...prevState, ...newState };
    });
  };
  return [stateScreen, setStateScreen];
};

const AppProvider = ({ children }) => {
  let refVlands = useRef();
  let refDialog = useRef();
  let refDropAlert = useRef();
  const contextValue = useMemo(
    () => ({ refVlands, refDialog, refDropAlert }),
    []
  );

  return (
    <AppContext.Provider value={{ refVlands, refDialog, refDropAlert }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <Fragment>
          {children}
          <BaseDialog ref={refDialog} />
        </Fragment>
      </SafeAreaProvider>
    </AppContext.Provider>
  );
};
export default AppProvider;
export const useApp = () => useContext(AppContext);
