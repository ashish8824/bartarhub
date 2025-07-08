// context/UIContext.tsx
import { createContext, useContext, useState } from "react";

type UIContextType = {
  modal: React.ReactNode | null;
  openModal: (component: React.ReactNode) => void;
  closeModal: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [modal, setModal] = useState<React.ReactNode | null>(null);

  const openModal = (component: React.ReactNode) => setModal(component);
  const closeModal = () => setModal(null);

  return (
    <UIContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
      {modal}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within UIProvider");
  return context;
};
