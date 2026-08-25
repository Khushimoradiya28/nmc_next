const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User ID is required"],
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tbl_order',
    required: [true, "Order ID is required"],
  },
  ticket_status: {
    type: String,
    enum: ['open', 'progress', 'resolved', 'closed'],
    default: 'open'
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true
  },
  category: {
    type: String,
    enum: ['billing', 'technical', 'general'],
    required: [true, "Category is required"]
  },
  status: {
    type: Number,
    default: 1 // 1: Active, 0: Deleted
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

supportTicketSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
