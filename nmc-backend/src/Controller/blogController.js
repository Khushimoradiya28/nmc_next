const Blog = require("../Model/blog");
const config = require("../Config/app");
const fs = require("fs");
const path = require("path");
const { generateSlug } = require("../helper");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects } = require("../Utils/imageProcessor");

exports.addBlog = async (req, res, next) => {
  try {
    const body = req.body || {};
    
    // Normalize keys
    Object.keys(body).forEach(key => {
        body[key.toLowerCase()] = body[key];
    });

    if (!body.title) {
        return res.status(400).json({ status: 400, message: "Title is required" });
    }

    if (!body.content) {
        return res.status(400).json({ status: 400, message: "Content is required" });
    }

    // Auto-generate slug if not provided, or normalize provided one
    let slug = body.slug ? generateSlug(body.slug) : generateSlug(body.title);
    
    // Check for existing slug
    // Removed as per request
    body.slug = slug;

    // Handle Image
    if (req.file) {
      if (config.NODE_ENV === "production") {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "blog");
        body.blog_image = uploadResult.originalKey;
        body.blog_image_webp = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "blog");
        body.blog_image = result.originalPath;
        body.blog_image_webp = result.webpPath;
      }
    }

    const blog = await Blog.create(body);

    res.status(200).json({
      status: 200,
      message: "Blog created successfully",
      data: blog,
    });

  } catch (error) {
    if (req.file && config.NODE_ENV !== "production") {
        // cleanup temp file if error
        const imagePath = path.join(__dirname, "../media/blog", req.file.filename);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    next(error);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const { status, search, limit, offset, sort_by, sort_order, is_featured } = req.body || {};

    const statusFilter = status && status.length ? status : ["1"];
    let query = { status: { $in: statusFilter } };

    if (is_featured !== undefined) {
        query.is_featured = is_featured;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author_name: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } } // Optional: search in content too
      ];
    }

    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;
    const sortField = sort_by || "created_at";
    const sortDirection = sort_order === "asc" ? 1 : -1;

    let blogQuery = Blog.find(query)
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset);

    if (pageLimit > 0) blogQuery = blogQuery.limit(pageLimit);

    const blogs = await blogQuery;
    const count = await Blog.countDocuments(query);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/blog";

    const data = blogs.map((blog) => {
      const fileName = blog.blog_image ? blog.blog_image.split("/").pop() : null;

      return {
        ...blog.toObject(),
        blog_image: fileName
          ? (config.NODE_ENV === "production"
            ? `${s3Url}/${fileName}`
            : `${baseUrl}/media/blog/${fileName}`
          )
          : null,
      };
    });

    res.status(200).json({
      message: "Blogs fetched successfully",
      status: 200,
      count,
      data: data,
    });

  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
    
    // Helper to delete temp file
    const deleteUploadedTemp = () => {
        if (req.file && config.NODE_ENV !== "production") {
          const uploadedFilePath = path.join(__dirname, "../media/blog", req.file.filename);
          if (fs.existsSync(uploadedFilePath)) {
            try { fs.unlinkSync(uploadedFilePath); } catch (e) {
                console.warn("Failed to delete temp file:", e.message);
            }
          }
        }
    };

    if (!req.body || !req.body.id) {
        deleteUploadedTemp();
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id } = req.body;
        const existingBlog = await Blog.findById(id);

        if (!existingBlog) {
            deleteUploadedTemp();
            return res.status(404).json({ message: "Blog not found" });
        }

        const updateData = {};
        const fields = [
            "title", "content", "author_name", "status", "published_at", 
            "meta_title", "meta_description", "meta_keywords", "tags", 
            "view_count", "is_featured", "slug"
        ];
        
        fields.forEach((field) => {
            if (req.body[field] !== undefined) updateData[field] = req.body[field];
        });

        if (updateData.slug && updateData.slug !== existingBlog.slug) {
            updateData.slug = generateSlug(updateData.slug);
        } else if (updateData.title && !updateData.slug && updateData.title !== existingBlog.title) {
            updateData.slug = generateSlug(updateData.title);
        }

        if (req.file) {
            let newOriginal, newWebp;
            try {
              if (config.NODE_ENV === "production") {
                const uploadResult = await uploadToS3AndCreateWebp(req.file, "blog");
                newOriginal = uploadResult.originalKey;
                newWebp = uploadResult.webpKey;
              } else {
                const result = await saveLocalAndCreateWebp(req.file, "blog");
                newOriginal = result.originalPath;
                newWebp = result.webpPath;
              }
            } catch (err) {
              deleteUploadedTemp();
              throw err;
            }
      
            const oldOriginal = existingBlog.blog_image;
            const oldWebp = existingBlog.blog_image_webp;
            
            try {
                if (config.NODE_ENV === "production") {
                  const keysToDelete = new Set();
                  if (oldOriginal) keysToDelete.add(oldOriginal);
                  if (oldWebp) keysToDelete.add(oldWebp);
        
                  if (!oldWebp && oldOriginal) {
                     // Try to guess webp if it wasn't stored
                    const ext = path.extname(oldOriginal);
                    const derived = oldOriginal.endsWith(ext) ? oldOriginal.replace(new RegExp(`${ext}$`), ".webp") : oldOriginal + ".webp";
                    keysToDelete.add(derived);
                  }
        
                  const keys = Array.from(keysToDelete).filter(Boolean);
                  if (keys.length > 0) await deleteS3Objects(keys);
                } else {
                  deleteLocalImages(oldOriginal, oldWebp);
                }
            } catch (err) {
                console.warn("Failed to delete old images:", err.message);
            }
      
            updateData.blog_image = newOriginal;
            updateData.blog_image_webp = newWebp;
        }

        updateData.updated_at = Date.now();

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 200,
            message: "Blog updated successfully",
            data: updatedBlog
        });

    } catch (error) {
        deleteUploadedTemp();
        next(error);
    }
};

exports.deleteBlog = async (req, res, next) => {
    if (!req.body || !req.body.id) {
        return res.status(400).json({
          status: 400,
          error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id } = req.body;
        // Soft delete
        const blog = await Blog.findByIdAndUpdate(
            id,
            { status: "0", updated_at: Date.now() },
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ status: 200, message: "Blog deleted successfully", data: blog });
    } catch (error) {
        next(error);
    }
};
