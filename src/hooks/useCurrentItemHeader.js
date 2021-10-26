import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export const useCurrentItemHeader = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { header } = useSelector((state) => ({ ...state }));
  const [key, setKey] = useState(null);

  const dispatchKey = useCallback(
    (payload) => dispatch({ type: "SET_KEY_ITEM", payload }),
    [dispatch]
  );

  const checkCurrentPage = useCallback(() => {
    const availablePages = {
      home: "home",
      shop: "shop",
      cart: "cart",
      register: "register",
      login: "login",
      user: "user-dash",
      admin: "user-admin",
    };

    const defaultPage = header || "home";
    const currentPage = history.location.pathname.split("/")[1];
    const payload = availablePages[currentPage] || defaultPage;
    dispatchKey(payload);
  }, [dispatchKey, header, history.location.pathname]);

  const checkIfKeyContainsValue = useCallback(
    () => !key && checkCurrentPage(),
    [checkCurrentPage, key]
  );

  useEffect(
    () => checkIfKeyContainsValue(),
    [checkCurrentPage, checkIfKeyContainsValue]
  );

  return { setKey: (key) => setKey(dispatchKey(key)) };
};
