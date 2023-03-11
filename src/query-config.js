import { notification } from 'antd';
import { QueryCache, QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      notification.error({
        description: error?.response?.data?.message || 'An Error Occurred',
        message: 'Error',
      });
    },
  }),
});

export default queryClient;
