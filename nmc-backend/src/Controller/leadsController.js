const Leads = require('../Model/leads');

exports.addLead = async (req, res, next) => {
  try {

    const leadData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      mobile: req.body.mobile,
      email: req.body.email || null,
      message: req.body.message || null,
      product_id: req.body.product_id || null,
      lead_type: req.body.lead_type || 'contact',

      ip_address: req.body.ip_address || null,
      browser_name: req.body.browser_name || null,
      browser_version: req.body.browser_version || null,
      browser_platform: req.body.browser_platform || null,

      utm_source: req.body.utm_source || req.body.USOURCE || null,
      utm_medium: req.body.utm_medium || req.body.UMEDIUM || null,
      utm_campaign: req.body.utm_campaign || req.body.UCAMPAIGN || null,
      utm_content: req.body.utm_content || req.body.UCONTENT || null,
      utm_term: req.body.utm_term || req.body.UTERM || null,

      ireferrer: req.body.ireferrer || req.body.IREFERRER || null,
      lreferrer: req.body.lreferrer || req.body.LREFERRER || null,
      ilandpage: req.body.ilandpage || req.body.ILANDPAGE || null,
      visits: req.body.visits ? parseInt(req.body.visits) : (req.body.VISITS ? parseInt(req.body.VISITS) : 0)
    };

    const leads = await Leads.create(leadData);

    res.status(200).json({
      status: 200,
      message: "Lead added successfully",
      data: leads
    });

  } catch (error) {
    next(error);
  }
};

exports.getAllLeads = async (req, res, next) => {
  try {
    const { status, search, limit, offset, sort_by, sort_order,from_date, to_date, lead_type } = req.body || {};

    const statusFilter = status && status.length ? status : [1];
    let query = { status: { $in: statusFilter } };


    //Lead Type Filter
    if (lead_type) {
      if (Array.isArray(lead_type) && lead_type.length > 0) {
        query.lead_type = { $in: lead_type };
      } else {
        query.lead_type = lead_type;
      }
    }


    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { utm_source: { $regex: search, $options: 'i' } },
        { utm_medium: { $regex: search, $options: 'i' } },
        { utm_campaign: { $regex: search, $options: 'i' } },
        { utm_content: { $regex: search, $options: 'i' } },
        { utm_term: { $regex: search, $options: 'i' } },
        { initial_referrer: { $regex: search, $options: 'i' } },
        { last_referrer: { $regex: search, $options: 'i' } },
        { landing_page: { $regex: search, $options: 'i' } },
      ];
    }

    // Date filter using created_at field
    if (from_date || to_date) {
      query.created_at = {};

      if (from_date) {
        query.created_at.$gte = new Date(from_date);
      }

      if (to_date) {
        query.created_at.$lte = new Date(new Date(to_date).setHours(23, 59, 59, 999));
      }
    }

    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;

    const sortField = sort_by || 'createdAt';
    const sortDirection = sort_order === 'asc' ? 1 : -1;

    let leadsQuery = Leads.find(query)
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset);

    if (pageLimit > 0) {
      leadsQuery = leadsQuery.limit(pageLimit);
    }

    const leads = await leadsQuery;
    const count = await Leads.countDocuments(query);

    res.status(200).json({
      message: 'Leads fetched successfully',
      status: 200,
      count,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};