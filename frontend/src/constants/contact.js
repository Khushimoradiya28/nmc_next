/**
 * Centralized Contact Information Architecture
 * All field values are kept empty for future CMS dynamic loading.
 */
export const CONTACT_INFO = {
  address: {
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    formatted: ''
  },
  phone: {
    primary: '',
    secondary: '',
    fax: ''
  },
  email: {
    general: '',
    admissions: '',
    support: ''
  },
  googleMap: {
    embedUrl: '',
    locationUrl: '',
    latitude: '',
    longitude: ''
  },
  workingHours: {
    weekdays: '',
    saturday: '',
    sunday: '',
    closedDays: []
  }
};

export default CONTACT_INFO;
