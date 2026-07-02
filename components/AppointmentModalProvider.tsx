"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { LayoutGroup } from "framer-motion";
import AppointmentModal from "./AppointmentModal";

type Ctx = {
  /**
   * Open the modal. `source` is the layoutId of the clicked trigger — the
   * button with that layoutId physically morphs into the modal panel.
   */
  open: (source: string) => void;
  close: () => void;
  /** The layoutId currently driving the morph (null when closed). */
  activeSource: string | null;
};

const ModalCtx = createContext<Ctx | null>(null);

export function useAppointmentModal(): Ctx {
  const ctx = useContext(ModalCtx);
  if (!ctx) {
    throw new Error(
      "useAppointmentModal must be used within <AppointmentModalProvider>"
    );
  }
  return ctx;
}

export default function AppointmentModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [source, setSource] = useState<string | null>(null);

  const open = useCallback((s: string) => setSource(s), []);
  const close = useCallback(() => setSource(null), []);

  return (
    <ModalCtx.Provider value={{ open, close, activeSource: source }}>
      {/* LayoutGroup lets the triggers (deep in `children`) and the modal panel
          share layoutIds so the button can morph into the panel. */}
      <LayoutGroup>
        {children}
        <AppointmentModal source={source} onClose={close} />
      </LayoutGroup>
    </ModalCtx.Provider>
  );
}
