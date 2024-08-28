import { useStorageState } from '@/hooks/useStorageState';
import {
  useContext,
  createContext,
  PropsWithChildren,
  FC,
  useMemo,
  useCallback,
} from 'react';

type AuthContextType = {
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
};

export const sessionKey = 'session';

export const AuthContext = createContext<AuthContextType>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (process.env.NODE_ENV !== 'production' && !context) {
    throw new Error('useAuth must be wrapped in a <SessionProvider />');
  }

  return context;
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [[isLoading, session], setSession] = useStorageState(sessionKey);

  const signIn = useCallback(() => {
    // TODO: Perform sign-in logic here
    setSession('xxx');
  }, [setSession]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      signIn,
      signOut: () => {
        setSession(null);
      },
      session,
      isLoading,
    }),
    [isLoading, session, setSession, signIn],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
