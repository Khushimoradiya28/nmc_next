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

## API Documentation

See [API Documentation](API_DOCUMENTATION.md) for detailed endpoint information.

