"use client";

import { useConnection } from "provider/ConnectionProvider";

export function ConnectionStatus() {
  const { isOnline, type } = useConnection();

  // Exibe mensagem se offline
  if (!isOnline) {
    return (
      <div className="bg-red-600 text-white text-sm px-3 py-1 rounded shadow">
        <strong>Offline</strong>
      </div>
    );
  }

  // Exibe mensagem com tipo de rede se online
  if (type && type === "3g") {
    return (
      <div className="bg-red-600 text-white text-sm px-3 py-1 rounded shadow">
        <strong>Offline</strong>
      </div>
    );
  }

  // Caso não seja possível detectar o tipo de rede
  return (
    <div className="bg-blue-600 text-white text-sm px-3 py-1 rounded shadow">
      <strong>Online</strong>
    </div>
  );
}
