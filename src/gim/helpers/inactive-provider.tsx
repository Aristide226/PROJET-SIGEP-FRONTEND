// To disconnect user after 30 minutes
import { createContext, FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useGimSignOut } from './use-sign-out';

interface InactiveContextType {
  isIdle: boolean;
  reset: () => void;
}

const InactiveContext = createContext<InactiveContextType>({
  isIdle: false,
  reset: () => {},
});

const GimInactiveProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isIdle, setIsIdle] = useState(false);
  const signOut = useGimSignOut();

  const { getRemainingTime, reset } = useIdleTimer({
    timeout: 1800000,
    onIdle: () => {
      setIsIdle(true);
    },
    onActive: ()=> {
      setIsIdle(false);
    }
  });

  useEffect(() => {
    if (isIdle) {
      // DECONNECTER L'UTILISATEUR
      signOut();
    }
  }, [isIdle])
  
  return (
    <InactiveContext.Provider value={{ isIdle, reset}}>
      { children }
    </InactiveContext.Provider>
  );
};

export { InactiveContext, GimInactiveProvider};
