import requests from './httpService';

const ActivityLogServices = {
  // Get all activity logs with filters & pagination
  getActivityLogs: async ({
    page = 1,
    limit = 20,
    search = '',
    role_name = '',
    module = '',
    action = '',
    from_date = '',
    to_date = '',
    sort_by = 'created_at',
    sort_order = 'desc',
  } = {}) => {
    let url = `/activity-logs?page=${page}&limit=${limit}&sort_by=${sort_by}&sort_order=${sort_order}`;
    if (search && search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
    if (role_name && role_name !== 'all') url += `&role_name=${encodeURIComponent(role_name)}`;
    if (module && module !== 'all') url += `&module=${encodeURIComponent(module)}`;
    if (action && action !== 'all') url += `&action=${encodeURIComponent(action)}`;
    if (from_date) url += `&from_date=${encodeURIComponent(from_date)}`;
    if (to_date) url += `&to_date=${encodeURIComponent(to_date)}`;

    return requests.get(url);
  },
};

export default ActivityLogServices;
