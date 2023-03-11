import axios from 'axios';

import Auth from './Auth';
import Breed from './Breed';
import Clinic from './Clinic';
import Diagnosis from './Diagnosis';
import Medication from './Medications';
import Pet from './Pet';
import Question from './Question';
import Roles from './Roles';
import Species from './Species';
import Status from './Status';
import Treatment from './Treatment';
import Users from './Users';
import Vaccine from './Vaccines';
import Visitation from './Visitation';
import PetParent from './PetParent';
import Color from './Color';
import Gender from './Gender';
import Soap from './Soap';
import setAuthToken from 'utils/setAuthToken';
import Differentials from './Differentials';

export const baseApiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/v2`,
});

export const customAxios = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/v2`,
});

const userAuthDetails = JSON.parse(
  localStorage.getItem('whiskerUserDetails') || '{}',
);

const api = {
  auth: new Auth(baseApiClient),
  clinic: new Clinic(baseApiClient),
  question: new Question(baseApiClient),
  roles: new Roles(baseApiClient),
  users: new Users(baseApiClient),
  medications: new Medication(baseApiClient),
  vaccines: new Vaccine(baseApiClient),
  breeds: new Breed(baseApiClient),
  species: new Species(baseApiClient),
  pet: new Pet(baseApiClient),
  visitation: new Visitation(baseApiClient),
  diagnosis: new Diagnosis(baseApiClient),
  treatment: new Treatment(baseApiClient),
  status: new Status(baseApiClient),
  petParents: new PetParent(baseApiClient),
  colors: new Color(baseApiClient),
  genders: new Gender(baseApiClient),
  soap: new Soap(baseApiClient),
  differentials: new Differentials(baseApiClient),
};

baseApiClient.interceptors.response.use(
  (response) => response,
  async function (error) {
    if (error.response) {
      if (
        error.response.status === 401 &&
        error.response.data.message === 'Invalid token.'
      ) {
        let res = await customAxios.post('/auth/refresh', {
          refreshToken: JSON.parse(localStorage.getItem('whiskerUserDetails'))
            .refreshToken,
        });

        if (res.status === 201) {
          error.config.headers['Authorization'] = `Bearer ${res.data.token}`;

          setAuthToken(res?.data?.token);

          localStorage.setItem(
            'whiskerUserDetails',
            JSON.stringify({
              ...userAuthDetails,
              token: res.data.token,
              refreshToken: res.data.refreshToken,
            }),
          );

          return baseApiClient.request(error.config);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
