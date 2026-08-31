import requests from './httpService';

const AdmissionLeadServices = {
  // 1. Get All Admission Leads from Backend Database
  getAllAdmissions: async ({ page = 1, limit = 50, search = '', status = '', from_date = '', to_date = '', sort_order = 'desc' } = {}) => {
    let url = '/admission?page=' + page + '&limit=' + limit;
    if (search && search.trim()) url += '&search=' + encodeURIComponent(search.trim());
    if (status && status !== 'all') url += '&status=' + encodeURIComponent(status);
    if (from_date) url += '&from_date=' + encodeURIComponent(from_date);
    if (to_date) url += '&to_date=' + encodeURIComponent(to_date);
    if (sort_order) url += '&sort_order=' + encodeURIComponent(sort_order);
    return requests.get(url);
  },

  // 2. Get Single Admission Lead by ID
  getAdmissionById: async (id) => {
    return requests.get('/admission/' + id);
  },

  // 3. Update Admission Lead Status
  updateAdmissionStatus: async (id, status) => {
    return requests.put('/admission/' + id, { status });
  },

  // 4. Delete Admission Lead (Soft Delete)
  deleteAdmission: async (id) => {
    return requests.delete('/admission/' + id);
  },
};

export default AdmissionLeadServices;
