"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextValue {
  isNewRestaurantOpen: boolean;
  openNewRestaurant: () => void;
  closeNewRestaurant: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isNewRestaurantOpen, setIsNewRestaurantOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        isNewRestaurantOpen,
        openNewRestaurant: () => setIsNewRestaurantOpen(true),
        closeNewRestaurant: () => setIsNewRestaurantOpen(false),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
}