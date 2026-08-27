const mongoose = require('mongoose');

const academicProgramSchema = new mongoose.Schema(
  {
    programType: {
      type: String,
      enum: ['ug', 'pg', 'diploma'],
      required: true,
      default: 'ug',
      index: true
    },
    degreeBadge: {
      type: String,
      required: true,
      trim: true,
      default: 'UG DEGREE'
    },
    shortTitle: {
      type: String,
      required: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    highlights: {
      type: [String],
      default: []
    },
    duration: {
      type: String,
      required: true,
      trim: true
    },
    fees: {
      type: String,
      required: true,
      trim: true
    },
    sort_order: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    is_deleted: {
      type: Boolean,
      default: false,
      index: true
    },
    guid: {
      type: String,
      default: null
    },
    slug: {
      type: String,
      unique: true,
      index: true
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
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('AcademicProgram', academicProgramSchema);
