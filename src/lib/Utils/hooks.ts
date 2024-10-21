// imports from vendors
import { useContext, useState, useEffect } from 'react';
import { MobXProviderContext } from 'mobx-react';
import { ToastProps, useToast } from '@chakra-ui/react';

//import from store
import { MainConfigStore } from '../Store';

export const useMobxStore = (storeName: string) => useContext(MobXProviderContext)[storeName];

export const useWindowDimensions = () => {
  const hasWindow = typeof window !== 'undefined';

  const getWindowDimensions = () => {
    const width = hasWindow ? Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) : 0;
    const height = hasWindow ? Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) : 0;
    return { width, height };
  };

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => setWindowDimensions(getWindowDimensions());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
};

const defaultError = {
  en: 'Something went wrong!',
  uk: 'Щось пішло не так!',
  ru: 'Что-то пошло не так!',
};

const networkError = {
  en: 'Network error!',
  uk: 'Помилка мережі!',
  ru: 'Ошибка сети!',
};

type AlertHookProps = () => {
  chakraAlert: (props: ToastProps) => void;
  chameleonAlert:(alert: string, trigger: boolean, hold?: number) => void;
  closeAll: () => void;
  defaultErrorAlert: () => void;
  errorAlert: (alert: string) => void;
  infoAlert: (alert: string) => void;
  networkErrorAlert: () => void;
  successAlert: (alert: ToastProps) => void;
};

export const useAlerts: AlertHookProps = () => {
  const toast = useToast();
  return {
    chakraAlert: (props: ToastProps) => toast(props),
    chameleonAlert: (alert: string, trigger: boolean, hold = 0) => toast({
      containerStyle: { display: 'flex', justifyContent: 'center', textAlign: 'center' },
      duration: hold || (trigger ? 3000 : 5000),
      status: trigger ? 'success' : 'error',
      title: alert,
    }),
    closeAll: () => toast.closeAll(),
    defaultErrorAlert: () => toast({
      containerStyle: { display: 'flex', justifyContent: 'center' },
      duration: 5000,
      status: 'error',
      title: defaultError[MainConfigStore.language],
    }),
    networkErrorAlert: () => toast({
      containerStyle: { display: 'flex', justifyContent: 'center' },
      duration: 6000,
      status: 'error',
      title: networkError[MainConfigStore.language],
    }),
    errorAlert: (alert: string) => toast({
      containerStyle: { display: 'flex', justifyContent: 'center' },
      duration: 5000,
      status: 'error',
      title: alert,
    }),
    infoAlert: (alert: string) => toast({
      containerStyle: { display: 'flex', justifyContent: 'center' },
      duration: 5000,
      status: 'info',
      title: alert,
    }),
    successAlert: (props: ToastProps) => toast(
      {
        containerStyle: { bg: 'bgSecondary', rounded: 6 },
        status: 'success',
        ...props,
      }
    ),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};
