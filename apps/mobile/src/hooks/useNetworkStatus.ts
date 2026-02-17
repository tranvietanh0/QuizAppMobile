import { useEffect, useState, useCallback } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

import { useAppStore } from "@/stores/app.store";

/**
 * Network status types
 */
interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

/**
 * Hook for monitoring network status
 * Syncs with app store and provides local state
 */
export function useNetworkStatus() {
  const setOnline = useAppStore((state) => state.setOnline);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: null,
  });

  const handleNetworkChange = useCallback(
    (state: NetInfoState) => {
      const isConnected = state.isConnected ?? false;
      const isInternetReachable = state.isInternetReachable ?? null;

      setNetworkStatus({
        isConnected,
        isInternetReachable,
        type: state.type,
      });

      // Update global app store
      setOnline(isConnected && isInternetReachable !== false);
    },
    [setOnline]
  );

  useEffect(() => {
    // Get initial state
    NetInfo.fetch().then(handleNetworkChange);

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    return () => {
      unsubscribe();
    };
  }, [handleNetworkChange]);

  return networkStatus;
}

export default useNetworkStatus;
