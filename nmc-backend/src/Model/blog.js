const mongoose = require("mongoose");
const { generateRandomString } = require('../helper');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, "Slug is required"]
  },
  content: {
    type: String,
    required: [true, "Content is required"]
  },
  blog_image: {
    type: String,
    default: null
  },
  author_name: {
    type: String,
    default: null,
    trim: true
  },
  status: {
    type: String,
    default: "1" // 1 for active, 0 for deleted/inactive
  },
  published_at: {
    type: Date,
    default: Date.now
  },
  meta_title: {
    type: String,
    default: null
  },
  meta_description: {
    type: String,
    default: null
  },
  meta_keywords: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  view_count: {
    type: Number,
    default: 0
  },
  is_featured: {
    type: Number,
    default: 0 // 0 for not featured, 1 for featured
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

blogSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
