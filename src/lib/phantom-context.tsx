import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { toast } from "sonner";

type PhantomProvider = {
  isPhantom?: boolean;
  publicKey: { toString: () => string } | null;
  isConnected: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  removeAllListeners?: () => void;
};

declare global {
  interface Window {
    solana?: PhantomProvider;
    phantom?: { solana?: PhantomProvider };
  }
}

type Ctx = {
  publicKey: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  installed: boolean;
};

const PhantomContext = createContext<Ctx | null>(null);

function getProvider(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  const p = window.phantom?.solana ?? window.solana;
  return p?.isPhantom ? p : null;
}

export function PhantomProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;
    setInstalled(true);

    // Try eager (trusted) connect
    provider.connect({ onlyIfTrusted: true })
      .then(({ publicKey }) => setPublicKey(publicKey.toString()))
      .catch(() => {});

    const onConnect = () => {
      if (provider.publicKey) setPublicKey(provider.publicKey.toString());
    };
    const onDisconnect = () => setPublicKey(null);
    const onAccountChanged = (...args: unknown[]) => {
      const pk = args[0] as { toString: () => string } | null;
      setPublicKey(pk ? pk.toString() : null);
    };
    provider.on("connect", onConnect);
    provider.on("disconnect", onDisconnect);
    provider.on("accountChanged", onAccountChanged);
  }, []);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
      toast.error("Phantom belum terpasang", { description: "Install ekstensi Phantom lalu coba lagi." });
      return;
    }
    setConnecting(true);
    try {
      const { publicKey } = await provider.connect();
      setPublicKey(publicKey.toString());
      toast.success("Phantom terhubung", { description: publicKey.toString().slice(0, 8) + "…" });
    } catch (e) {
      toast.error("Gagal menghubungkan Phantom");
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) return;
    await provider.disconnect();
    setPublicKey(null);
    toast.success("Phantom diputus");
  }, []);

  return (
    <PhantomContext.Provider value={{ publicKey, connecting, connect, disconnect, installed }}>
      {children}
    </PhantomContext.Provider>
  );
}

export function usePhantom() {
  const ctx = useContext(PhantomContext);
  if (!ctx) throw new Error("usePhantom must be used within PhantomProvider");
  return ctx;
}
