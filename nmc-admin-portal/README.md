# Image Upload Rules & Guidelines (Frontend & Backend)

## 📌 1. Allowed Image Formats & Size Limit
- **Supported Formats**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`
- **Recommended Format**: `.webp` (Optimized for modern web performance)
- **Maximum File Size**: **5 MB** per image file.

---

## 📌 2. Field Name & Payload Rules (Multipart / FormData)
- **Single Multer Field Name**: Jab bhi koi image upload karni ho, FormData me key ka naam **strictly `'image'`** hona chahiye:
  ```javascript
  const formData = new FormData();
  formData.append('image', file); // File object from <input type="file" />
  ```
- ⚠️ **Strict Restriction (No Extra Image Keys)**: FormData me duplicate keys jaise `imageUrl`, `image_url`, `avatar`, `photo` **append NA karein**. Backend multer `upload.single('image')` configured hai, multiple ya unmatched field names aane par backend **`MulterError: Unexpected field`** throw karega.

---

## 📌 3. Content-Type & Axios Headers Rule
- **Boundary Auto-Generation**: Jab payload `FormData` ho, tab header me manually `'Content-Type': 'multipart/form-data'` set na karein ya default `'application/json'` ko interceptor me delete karein taaki browser khud boundary parameter generate kare:
  ```
  Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
  ```
- **Axios Config Structure**:
  ```javascript
  // Correct Axios calling format:
  instance.put('/api/endpoint/:slug', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  ```

---

## 📌 4. Storage & Image URL Resolution Rule
- **Backend Storage Path**: Backend uploaded images ko `uploads/` folder me save karta hai aur database me unique timestamp filename store karta hai (e.g. `1787748521023-162359744.webp`).
- **Frontend URL Mapping**: Database se filename milne par frontend components use backend origin ke sath `/uploads/` prefix lagakar render karenge:
  - **Relative / Filename**: `http://localhost:5000/uploads/1787748521023-162359744.webp`
  - **Full HTTP/S URL**: As-is render hoga bina modify kiye.
  - **Fallback Handling**: Broken link ya null image par standard default fallback placeholder `https://runrkids.s3.ap-south-1.amazonaws.com/media/default/default.png` render hoga `onError` event ke sath.

---

## 📌 5. Form Add vs. Update Image Rules
- **Add Mode (`!id`)**:
  - Drawer open hone par file input aur image preview box completely **empty / blank** hona chahiye.
- **Update / Edit Mode (`id` / `slug`)**:
  - Drawer open hone par existing image backend se fetch hokar preview box me display hogi.
  - Agar user nayi file select karta hai, to `URL.createObjectURL(file)` se instant live preview dikhega aur submit karne par `FormData` me nayi file jayegi.
  - Agar user nayi file select nahi karta, to text payload me existing `imageUrl` string jayegi bina file re-upload kiye.

---

## 📌 6. Applied Modules
Ye rules niche diye gaye sabhi modules ke liye apply hote hain:
1. **Professional Certificate Courses** (`/api/certificate-courses`)
2. **Awards & Certificates** (`/api/awards`)
3. **Testimonials - Dignitary & Students** (`/api/testimonials`)
4. **Academic Programs (Master Courses)** (`/api/academic-programs`)

---

## 📌 7. Global API Development & Validation Rules (Mandatory)

### 🔹 Rule A: Requirements & Reusable API Architecture
- **Check Requirements First**: Har API development se pehle requirement analyse karke clean aur reusable pattern follow karein (e.g. standard pagination, search filters, lookup by slug/ID, soft-delete, active/inactive toggles).
- **Reusable Operations**:
  - `GET /api/module` (with `page`, `limit`, `search`, `status`, `category` filters)
  - `GET /api/module/:slug` (supports both MongoDB `_id` and unique `slug`)
  - `POST /api/module` (full create with automated slug generation)
  - `PUT /api/module/:slug` (partial/full update with validation)
  - `DELETE /api/module/:slug` (safe soft delete with `is_deleted: true`)

### 🔹 Rule B: Strict Input Validation & Handled Status Codes (422 vs 400 vs 404)
Har API me input fields ko standard HTTP status codes ke sath validate karna mandatory hai:
- **Blank / Missing / Invalid Data (`422 Unprocessable Entity`)**: Jab client request syntax (JSON) valid ho lekin payload ke andar mandatory fields blank string `""`, missing, whitespace, ya invalid enum/data type hon, toh server **`422 Unprocessable Entity`** return karega:
  ```json
  {
    "status": 422,
    "success": false,
    "message": "Validation error: Unable to process input fields",
    "errors": [
      "shortTitle is required and cannot be blank (e.g. B.B.A.).",
      "fees is required and cannot be blank (e.g. ₹8,000 / Sem)."
    ]
  }
  ```
- **Malformed Request Syntax (`400 Bad Request`)**: `400 Bad Request` sirf tab use hoga jab client request body syntactically invalid/broken ho (e.g., corrupted JSON string, bad header format) jise server decode na kar sake.
- **Resource Not Found (`404 Not Found`)**: Agar update/delete/get me given ID/Slug database me exist nahi karta ya soft-deleted hai, toh **`404 Not Found`** return hoga.
- **Proper Status Codes Standard**:
  - `200 OK`: Successful fetch / update / delete.
  - `201 Created`: Successful creation.
  - `422 Unprocessable Entity`: Validation error (blank fields, invalid enum/data format).
  - `400 Bad Request`: Malformed syntax / client-side parsing error.
  - `404 Not Found`: Resource not found.
  - `500 Internal Server Error`: Unexpected server/database exceptions.

