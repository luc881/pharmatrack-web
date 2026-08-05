'use client';

// Carrito con persistencia en localStorage. Reglas idénticas al prototipo:
// - añadir un SKU existente suma cantidad
// - bajar de 1 elimina la línea
// - al añadir se abre el cajón y el contador pulsa 700 ms
// - el toast dura 2600 ms
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CartLine, Product, ZoneId } from '../types';
import { money } from '../lib/format';
import { shippingZones } from '../data/site';

const STORAGE_KEY = 'od.cart.v1';

interface CartContextValue {
  lines: CartLine[];
  count: number;
  drawerOpen: boolean;
  pulse: boolean;
  justAdded: string | null;
  toast: string | null;
  zone: ZoneId;
  add: (sku: string, qty?: number, variantId?: string) => void;
  inc: (sku: string) => void;
  dec: (sku: string) => void;
  remove: (sku: string) => void;
  clear: () => void;
  setZone: (z: ZoneId) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  totals: (products: Product[]) => {
    subtotal: number;
    shipping: number;
    total: number;
    subtotalLabel: string;
    shippingLabel: string;
    totalLabel: string;
  };
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [zone, setZone] = useState<ZoneId>('cdmx');
  const timers = useRef<number[]>([]);

  // Hidratación en un solo paso para no parpadear.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [lines]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const flash = useCallback(
    (msg: string) => {
      setToast(msg);
      later(() => setToast(null), 2600);
    },
    [later],
  );

  const add = useCallback(
    (sku: string, qty = 1, variantId?: string) => {
      setLines((prev) => {
        const i = prev.findIndex((l) => l.sku === sku && l.variantId === variantId);
        if (i >= 0) {
          const next = prev.slice();
          next[i] = { ...next[i], qty: next[i].qty + qty };
          return next;
        }
        return [...prev, { sku, qty, variantId }];
      });
      setDrawerOpen(true);
      setPulse(true);
      setJustAdded(sku);
      later(() => setPulse(false), 700);
      later(() => setJustAdded(null), 1600);
    },
    [later],
  );

  const inc = useCallback((sku: string) => {
    setLines((prev) => prev.map((l) => (l.sku === sku ? { ...l, qty: l.qty + 1 } : l)));
  }, []);

  const dec = useCallback((sku: string) => {
    setLines((prev) =>
      prev.flatMap((l) => (l.sku !== sku ? [l] : l.qty <= 1 ? [] : [{ ...l, qty: l.qty - 1 }])),
    );
  }, []);

  const remove = useCallback((sku: string) => {
    setLines((prev) => prev.filter((l) => l.sku !== sku));
  }, []);

  const totals = useCallback(
    (products: Product[]) => {
      const price = (sku: string) => products.find((p) => p.sku === sku)?.price ?? 0;
      const subtotal = lines.reduce((a, l) => a + price(l.sku) * l.qty, 0);
      const z = shippingZones.find((s) => s.id === zone)!;
      return {
        subtotal,
        shipping: z.cost,
        total: subtotal + z.cost,
        subtotalLabel: money(subtotal),
        shippingLabel: z.cost === 0 ? z.note : money(z.cost),
        totalLabel: money(subtotal + z.cost),
      };
    },
    [lines, zone],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((a, l) => a + l.qty, 0),
      drawerOpen,
      pulse,
      justAdded,
      toast,
      zone,
      add,
      inc,
      dec,
      remove,
      clear: () => setLines([]),
      setZone,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      totals,
    }),
    [lines, drawerOpen, pulse, justAdded, toast, zone, add, inc, dec, remove, totals],
  );

  // `flash` se expone por contexto sólo si el toast global lo necesita; si no, bórralo.
  void flash;

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
