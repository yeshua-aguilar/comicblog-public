import { createContext } from 'react';
import type { AuthContextType } from './loginContexto';

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });