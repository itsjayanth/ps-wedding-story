'use client';
import { createContext, useContext } from 'react';

/** `entered` is true once the visitor has passed the gate (or if there is no gate). */
export const EntryContext = createContext<{ entered: boolean }>({ entered: true });
export const useEntry = () => useContext(EntryContext);
export const ENTERED_EVENT = 'ps:entered';
