const SupportTicket = require("../Model/supportTicket");

exports.addTicket = async (req, res, next) => {
    try {
        const ticket = await SupportTicket.create(req.body);
        res.status(200).json({
            status: 200,
            message: "Ticket added successfully",
            data: ticket,
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllTickets = async (req, res, next) => {
    try {
        const { user_id, status, category, ticket_status, offset, limit, sort_by, sort_order } = req.body || {};

        const query = {};
        
        if (status !== undefined) query.status = status;
        else query.status = 1;

        if (user_id) query.user_id = user_id;
        if (category) query.category = category;
        if (ticket_status !== undefined) query.ticket_status = ticket_status;

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "created_at";
        const sortDirection = sort_order === "asc" ? 1 : -1;

        let ticketsQuery = SupportTicket.find(query)
            .populate("user_id", "first_name last_name email mobile")
            .populate("order_id", "order_invoice_no")
            .populate("created_by", "first_name last_name")
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);
        
        if (pageLimit > 0) {
            ticketsQuery = ticketsQuery.limit(pageLimit);
        }

        const tickets = await ticketsQuery;

        const total = await SupportTicket.countDocuments(query);

        res.status(200).json({
            status: 200,
            message: "Tickets fetched successfully",
            count: total,
            data: tickets
        });

    } catch (err) {
        next(err);
    }
};

exports.updateTicket = async (req, res, next) => {
    try {
        const { id, ticket_status } = req.body;

        if (!id) {
            return res.status(400).json({ status: 400, message: "Ticket ID is required" });
        }

        const updates = { updated_at: Date.now() };
        if (ticket_status !== undefined) updates.ticket_status = ticket_status;

        const ticket = await SupportTicket.findByIdAndUpdate(id, updates, { new: true });

        if (!ticket) {
            return res.status(404).json({ status: 404, message: "Ticket not found" });
        }

        res.status(200).json({
            status: 200,
            message: "Ticket updated successfully",
            data: ticket
        });

    } catch (err) {
        next(err);
    }
};

exports.deleteTicket = async (req, res, next) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ status: 400, message: "Ticket ID is required" });
        }

        // Soft delete
        const ticket = await SupportTicket.findByIdAndUpdate(id, { status: 0, updated_at: Date.now() }, { new: true });

        if (!ticket) {
            return res.status(404).json({ status: 404, message: "Ticket not found" });
        }

        res.status(200).json({
            status: 200,
            message: "Ticket deleted successfully",
            data: ticket
        });

    } catch (err) {
        next(err);
    }
};
