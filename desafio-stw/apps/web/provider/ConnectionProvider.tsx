"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type ConnectionType =
  | "wifi"
  | "ethernet"
  | "cellular"
  | "none"
  | "unknown"
  | "slow-2g"
  | "2g"
  | "3g"
  | "4g";

interface NetworkState {
  isOnline: boolean;
  type?: ConnectionType;
}

const ConnectionContext = createContext<NetworkState>({
  isOnline: true,
  type: undefined,
});

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<NetworkState>({
    isOnline: false,
    type: undefined,
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const isOnline = navigator.onLine;

      const connection = (navigator as Navigator & { connection?: any })
        .connection;

      let type: ConnectionType = "unknown";

      if (connection) {
        if (connection.effectiveType) {
          type = connection.effectiveType;
        }
        if (connection.type) {
          type = connection.type;
        }
      }

      const isTrulyOnline = isOnline && type !== "3g"; // considera 3g como offline
      setNetwork({ isOnline: isTrulyOnline, type });

      // Atualiza o sessionStorage
      sessionStorage.setItem(
        "isOnline",
        JSON.stringify({ isOnline: isTrulyOnline })
      );
    };

    updateNetworkStatus();

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    const conn = (navigator as any).connection;
    conn?.addEventListener?.("change", updateNetworkStatus);

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
      conn?.removeEventListener?.("change", updateNetworkStatus);
    };
  }, []);

  return (
    <ConnectionContext.Provider value={network}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const ctx = useContext(ConnectionContext);
  if (!ctx)
    throw new Error("useConnection deve ser usado dentro do ConnectionContext");
  return ctx;
}
