"use client";
import React, { useState, useEffect, useMemo, createContext } from "react";
import { AppConfig, UserSession } from "@stacks/connect";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  let [userSession, setUserSession] = useState({});
  const test=3

    userSession = useMemo(() => {
    const appConfig = new AppConfig();
    return new UserSession({ appConfig });
  }, []);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  },[userSession]);

  return (
    <UserContext.Provider value={{ userData, userSession, setUserSession, setUserData, test }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
