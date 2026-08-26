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

2. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   S3_BUCKET_NAME=your_s3_bucket_name
   NODE_ENV=development
   ```

3. Start the server:
   ```bash
   node server
   ```

## Global API Rules & Standards

Har API me niche diye gaye rules strictly follow hone chahiye:

1. **Unique Identification & Timezone Standard**:
   - Every API & model record must contain:
     - Unique identifier: `_id` / `guid` (and `slug` where applicable).
     - `created_by` & `updated_by` (User ID / Admin ID).
     - `created_at` & `updated_at` timestamps strictly stored & formatted in **India Kolkata Time Zone (`Asia/Kolkata`)** (`YYYY-MM-DD HH:mm:ss`).
2. **Slug Sub-ID for Inner / Specific Operations (Security Policy)**:
   - Jab bhi kisi API me inner specific record add, update, delete ya fetch jaisa koi operation perform hota hai, tab direct internal DB ID exposure se bachne ke liye **`slug`** pass hona chahiye as sub ID.
   - Slug generation rule: Main heading / title / name ko lowercase me convert karke hyphenated slug (`generateSlug`) banana hai (e.g. `"A BENCHMARK FOR WOMEN'S HIGHER EDUCATION."` -> `"a-benchmark-for-womens-higher-education"`). Security purpose ke liye raw database IDs public URLs ya payload me pass nahi karni hai.

---

## Testimonial API Field Mapping & Validations

Admin portal ke do forms (Student Testimonials & Dignitary Testimonials) ke anusar field mapping:

### 1. Student Testimonials Form
| Admin Form Field Label | Backend Field Name | Type | Mandatory? | Notes / Validation Rule |
|-------------------------|--------------------|------|------------|-------------------------|
| **Testimonial Type \*** | `type` | String | **Yes** | Value: `"student"` |
| **Student Name \*** | `authorName` | String | **Yes** | Blank / empty not allowed (`"Student Name is mandatory."`) |
| **Course / Subtext \*** | `designationSubtext` | String | **Yes** | Blank / empty not allowed (`"Course / Subtext is mandatory."`) |
| **Rating \*** | `rating` | Number | **Yes** | Value between 1 to 5 (e.g., 5 for 5 Stars) |
| **Testimonial Quote \*** | `quote` | String | **Yes** | Blank / empty not allowed (`"Testimonial Quote is mandatory."`) |
| **Student Photo / Avatar** | `avatarUrl` | String | No | Image path / URL |

### 2. Dignitary Testimonials Form
| Admin Form Field Label | Backend Field Name | Type | Mandatory? | Notes / Validation Rule |
|-------------------------|--------------------|------|------------|-------------------------|
| **Testimonial Type \*** | `type` | String | **Yes** | Value: `"dignitary"` |
| **Headline / Title \*** | `title` | String | **Yes** | Blank / empty not allowed (`"Headline / Title is mandatory for Dignitary Testimonials."`) |
| **Dignitary Name \*** | `authorName` | String | **Yes** | Blank / empty not allowed (`"Dignitary Name is mandatory."`) |
| **Designation / Subtext \*** | `designationSubtext` | String | **Yes** | Blank / empty not allowed (`"Designation / Subtext is mandatory."`) |
| **Testimonial Quote \*** | `quote` | String | **Yes** | Blank / empty not allowed (`"Testimonial Quote is mandatory."`) |
| **Profile Photo / Image** | `avatarUrl` | String | No | Image path / URL |

---

## Testimonial Endpoints

- **List Testimonials**: `GET /api/testimonials` / `POST /api/testimonials/list`
  - Filters: `type` (`student` | `dignitary`), `isActive`, `search`, `slug`, `limit`, `offset`, `sort_by`, `sort_order`
- **Get Single Testimonial**: `GET /api/testimonials/:idOrSlug`
- **Add Testimonial**: `POST /api/testimonials` / `POST /api/testimonials/add`
- **Update Testimonial**: `PUT /api/testimonials/:idOrSlug` / `POST /api/testimonials/update`
- **Delete Testimonial**: `DELETE /api/testimonials/:idOrSlug` / `POST /api/testimonials/delete`

---

## API Documentation

See [API Documentation](API_DOCUMENTATION.md) for detailed endpoint information.