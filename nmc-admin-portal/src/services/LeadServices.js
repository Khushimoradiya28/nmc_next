import requests from './httpService';

const LeadServices = {
  // 1. Get All Contact Leads
  getAllLeads: async ({ page = 1, limit = 50, search = '', status = '', from_date = '', to_date = '', sort_order = 'desc' } = {}) => {
    let url = '/contact?page=' + page + '&limit=' + limit;
    if (search && search.trim()) url += '&search=' + encodeURIComponent(search.trim());
    if (status && status !== 'all') url += '&status=' + encodeURIComponent(status);
    if (from_date) url += '&from_date=' + encodeURIComponent(from_date);
    if (to_date) url += '&to_date=' + encodeURIComponent(to_date);
    if (sort_order) url += '&sort_order=' + encodeURIComponent(sort_order);
    return requests.get(url);
  },

  // 2. Get Single Lead by ID
  getLeadById: async (id) => {
    return requests.get('/contact/' + id);
  },

  // 3. Update Lead Status
  updateLeadStatus: async (id, status) => {
    return requests.put('/contact/' + id, { status });
  },

  // 4. Delete Lead (Soft Delete)
  deleteLead: async (id) => {
    return requests.delete('/contact/' + id);
  },
};

export default LeadServices;
