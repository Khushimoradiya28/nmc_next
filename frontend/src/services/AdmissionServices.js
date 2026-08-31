import requests from './httpService';

const AdmissionServices = {
  submitApplication: async (payload) => {
    return requests.post('/admission', payload);
  },
};

export default AdmissionServices;
