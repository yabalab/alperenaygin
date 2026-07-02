"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import AppointmentModal from "./AppointmentModal";

type Origin = { x: number; y: number };

type Ctx = {
  /** Open the modal, ballooning from the clicked element's centre. */
  openFrom: (e: MouseEvent<HTMLElement>) => void;
  close: () => void;
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
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState<Origin>({ x: 0, y: 0 });

  const openFrom = useCallback((e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ModalCtx.Provider value={{ openFrom, close }}>
      {children}
      <AppointmentModal isOpen={isOpen} origin={origin} onClose={close} />
    </ModalCtx.Provider>
  );
}
