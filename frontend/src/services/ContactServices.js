import requests from './httpService';

const ContactServices = {
  /**
   * Submit an inquiry from the Contact Page or Contact Popup Modal.
   * @param {{ firstName, lastName?, website?, reason?, course?, teacher?, message }} payload
   */
  submitInquiry: async (payload) => {
    return requests.post('/contact', payload);
  },
};

export default ContactServices;
