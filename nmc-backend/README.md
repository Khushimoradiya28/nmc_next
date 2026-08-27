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
3. **Mandatory Field Validation & HTTP Status Standards (422 vs 400 vs 404)**:
   - **Validation Error (422 Unprocessable Entity)**: Jab request syntax correct ho lekin fields blank `""`, missing, whitespace, ya invalid format/enum pass hon, tab strictly `422 Unprocessable Entity` status code return hona chahiye with field-level error details:
     ```json
     {
       "status": 422,
       "success": false,
       "message": "Validation error: Unable to process input fields",
       "errors": [
         "shortTitle is required and cannot be blank (e.g. B.B.A.).",
         "fees is required and cannot be blank (e.g. ₸8,000 / Sem)."
       ]
     }
     ```
   - **Malformed Syntax (400 Bad Request)**: `400 Bad Request` sirf tab use hoga jab client side se body malformed JSON ho, invalid Http headers/parameters hon, ya server request syntax decode na kar sake.
   - **Resource Not Found (404 Not Found)**: Jab requested slug ya ID database me exist na kare ya already soft-deleted ho tab `404 Not Found` return karein.
   - **Check Requirements & Reusable APIs (Rule)**: Har API me reusable pattern (pagination, search, slug/id lookup, soft-delete) proper status codes `2p0``/`201`/`422`/`404`/`500` ke sath handled hona chahiye.

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

5. **Soft Delete Policy (`is_deleted`, `status`, & `isActive`)**:
   - **No Hard Delete Allowed**: Kisi bhi main database record ko database collection se permanently delete (`deleteOne()`, `deleteMany()`, `findByIdAndDelete()`, ya `remove()`) **nahi** karna hai.
   - **Schema Requirements**:
     - Har schema me mandatory fields hone chahiye:
       ```javascript
       is_deleted: { type: Boolean, default: false, index: true },
       status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
       isActive: { type: Boolean, default: true, index: true }
       ```
   - **Delete Operation Action**:
     - Jab bhi koi Delete API (`DELETE /api/.../:idOrSlug` ya `POST /api/.../delete`) call hogi:
       - `is_deleted: true`
       - `status: "inactive"`
       - `isActive: false`
       - `updated_at: moment().tz("Asia/Kolkata").toDate()`
       - `updated_by: req.user ? req.user._id : body.updated_by`
   - **Read / Query Filtering**:
     - Sabhi listing, detail fetch, search, aur update queries me `{ is_deleted: false }` filter mandatory hona chahiye taaki soft-deleted records client aur admin list me display na ho:
       ```javascript
       const filter = { is_deleted: false, ...otherFilters };
       ```


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

8. **Image & File Uploading Standards (Local Storage & Cloud S3)**:
   - **No Base64 or Binary in DB**: Images ya media files ko directly database me Base64 / binary string ke roop me store **nahi** karna hai. Database me sirf image ka relative path ya public S3 URL store hoga.
   - **Multer Middleware & Supported Formats**:
     - Image uploads ke liye standard Multer middleware (`getMulterUpload("folder_name")`) use hoga.
     - Supported formats: `.jpeg`, `.jpg`, `.png`, `.webp`, `.svg` (Max size: 5MB to 10MB per file).
   - **Dual Storage Strategy (Local & Production S3)**:
     - **Development Mode (`NODE_ENV !== "production"`)**: 
       - Files locally `src/media/<folder_name>/` directory me store hongi aur Express static path (`/media/...`) se accessible hongi.
       - Sharp library dwara non-webp images ka `.webp` version automatically generate hoga for web performance.
     - **Production Mode (`NODE_ENV === "production"`)**:
       - Files automatically configured AWS S3 Bucket me stream/upload hongi (`uploadToS3AndCreateWebp`).
   - **Accessible URL in Responses**:
     - GET aur Write API responses me backend automatically full accessible URL construct karke return karega (e.g., `http://localhost:5000/media/awards/filename.webp` ya `https://bucket.s3.amazonaws.com/...`) under standardized keys: `image_url` / `imageUrl`.
   - **Old File Cleanup Policy**:
     - Record update hone par agar nayi image upload ki jaati hai, toh purani image file (`deleteLocalImages` ya `deleteS3Objects`) database/disk se clean/delete ho jani chahiye taaki server storage bloat na ho.


9. **Security & Authentication (JWT & Role Guards)**:
   - Admin/Private APIs par compulsory Authentication Middleware (`authGuard`) aur Role Checking (`roleGuard(['super_admin', 'admin'])`) hona chahiye.
   - Request object me logged-in user ki details (`req.user`) pass honi chahiye taaki `created_by` aur `updated_by` automatically fill ho sakein.

10. **Strict Code & AI File Generation Limits**:
    - AI Agent must NOT generate unnecessary helper, markdown, or redundant wrapper files.
    - Strict adherence to project architecture: `routes/`, `controllers/`, `models/`, `middlewares/`, `services/`.

## API Documentation

See [API Documentation](API_DOCUMENTATION.md) for detailed endpoint information.

