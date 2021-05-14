import { useEffect, useState } from 'react';
import { useRepositoryServices } from '../data-access/context';
import RepositoryServices from '../data-access/repository-services';

interface UseRequestProps<TResponse> {
  request: (services: RepositoryServices) => Promise<TResponse>;
  onData: (response: TResponse) => void;
}

const useRequest = <TResponse>(props: UseRequestProps<TResponse>): void => {
  const { request, onData } = props;
  const services = useRepositoryServices();
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const worker = async () => {
      const response = await request(services);

      if (isMounted) {
        onData(response);
      }
    };

    worker();

    return () => {
      setIsMounted(false);
    };
  }, [isMounted, onData, request, services]);
};

export default useRequest;
