# NMC Backend

Backend API for NMC e-commerce platform.

## Tech Stack

- **Node.js**: v20.19.2
- **Express**: Web framework
- **MongoDB**: Database
- **AWS S3**: File storage
- **Multer**: File uploads
- **ExcelJS**: Excel file generation

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server
   ```

## Global API & Service Rules

Every API, service, and data model in this project must strictly follow the standards below:

1. **Unique Identification & India Kolkata Timezone**:
   - Every API model/record must have:
     - Unique identifier: `_id` / `guid` (and `slug` where applicable).
     - `created_by`: User / Admin identifier who created the record.
     - `updated_by`: User / Admin identifier who last modified the record.
     - `created_at` & `updated_at`: Timestamps strictly stored and returned in **India Kolkata Time Zone (`Asia/Kolkata`)** in standard format (`YYYY-MM-DD HH:mm:ss`).
2. **Slug Sub-ID for Inner / Specific Operations (Security Policy)**:
   - Jab bhi kisi API me inner / specific record add, update, delete ya fetch jaisa operation perform hota hai, tab direct internal DB ID expose karne ke bajaye **`slug`** pass hona chahiye as sub ID.
   - Slug generation rule: Main heading / title / name ko lowercase me convert karke hyphenated slug (`generateSlug`) banana hai (e.g., `"A BENCHMARK FOR HIGHER EDUCATION"` -> `"a-benchmark-for-higher-education"`). Security purpose ke liye raw database IDs use nahi karna hai.
3. **Mandatory Field Validation & Error Standards**:
   - Har API request me mandatory fields blank ya invalid hone par `400 Bad Request` response return hona chahiye with structured error object containing exact field-wise error messages:
     ```json
     {
       "status": 400,
       "message": "Validation failed. Please fill all mandatory fields properly.",
       "error": {
         "fieldName": ["This field is mandatory."]
       }
     }
     ```


     4. **Standardized API Response Structure (Success & Error)**:
   - Har API response (Success ya Failure) ka format 100% consistent hona chahiye:
     - **Success Response (200/201)**:
       ```json
       {
         "success": true,
         "status": 200,
         "message": "Testimonial fetched successfully.",
         "data": { ... }
       }
       ```
     - **Server/Internal Error (500)**:
       ```json
       {
         "success": false,
         "status": 500,
         "message": "Internal Server Error. Please try again later.",
         "error": {}
       }
       ```

5. **Soft Delete Policy (`is_deleted` & `status`)**:
   - Kisi bhi main database record ko hard-delete (`remove()` / `deleteOne()`) nahi karna hai.
   - Har schema me `is_deleted: { type: Boolean, default: false }` aur `status: { type: String, enum: ['active', 'inactive'], default: 'active' }` hona chahiye.
   - Delete API request par record ki `is_deleted` property `true` set hogi taaki historical data database me preserve rahe.

6. **Pagination & Query Standard for GET APIs**:
   - Har list-fetching GET API (e.g., Testimonials, Blogs, Users) me mandatory pagination, search, aur status filter support hona chahiye:
     - Default Query Params: `?page=1&limit=10&search=&status=active`
   - Response me pagination metadata mandatory return hoga:
     ```json
     "meta": {
       "total_records": 45,
       "current_page": 1,
       "total_pages": 5,
       "limit": 10
     }
     ```

7. **Payload Sanitization & Trim Middleware**:
   - Every string value coming from body or params must be auto-trimmed (`.trim()`) to avoid whitespace pollution in the database.
   - HTML injection prevention / sanitization must be applied on text input fields.

<!-- 
8. **File Uploading Standard (AWS S3 & Local Fallback)**:
   - Images/Files directly database me base64 format me store nahi hongi.
   - File upload APIs strictly Multer + AWS S3/Cloud Storage path return karengi. Database me sirf image ka public URL (`avatar_url` / `image_path`) store hoga. -->
   

9. **Security & Authentication (JWT & Role Guards)**:
   - Admin/Private APIs par compulsory Authentication Middleware (`authGuard`) aur Role Checking (`roleGuard(['super_admin', 'admin'])`) hona chahiye.
   - Request object me logged-in user ki details (`req.user`) pass honi chahiye taaki `created_by` aur `updated_by` automatically fill ho sakein.

10. **Strict Code & AI File Generation Limits**:
    - AI Agent must NOT generate unnecessary helper, markdown, or redundant wrapper files.
    - Strict adherence to project architecture: `routes/`, `controllers/`, `models/`, `middlewares/`, `services/`.

## API Documentation

See [API Documentation](API_DOCUMENTATION.md) for detailed endpoint information.

