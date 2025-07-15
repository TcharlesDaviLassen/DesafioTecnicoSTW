import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Erro de conexão");
    return res.json();
  });

export function useMachineStatus(isOnline: boolean | null) {
  const { data, error, isLoading } = useSWR(
    `/api/status?isOnline=${isOnline}`,
    fetcher,
    {
      refreshInterval: isOnline ? 5000 : 0,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (isOnline && retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  const isDisconnected = Boolean(error);

  return { data, isLoading, isDisconnected };
}
