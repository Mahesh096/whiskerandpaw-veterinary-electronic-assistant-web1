import { baseApiClient } from 'api';

const setAuthToken = (token) => {
  if (token) {
    baseApiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete baseApiClient.defaults.headers.common['Authorization'];
  }
};

export default setAuthToken;
