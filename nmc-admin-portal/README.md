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

### 🔹 Rule B: Strict Input Validation & Handled Status Codes
Har API me input fields ko properly validate karna mandatory hai:
- **Blank / Missing Mandatory Fields**: Agar koi required field missing, blank string `""`, ya whitespace ho, toh request ko **`400 Bad Request`** status ke sath field-level error messages return karein:
  ```json
  {
    "status": 400,
    "success": false,
    "message": "Validation failed",
    "errors": [
      "shortTitle is required and cannot be blank (e.g. B.B.A.).",
      "fullName is required and cannot be blank."
    ]
  }
  ```
- **Enum / Uneven Data Validation**: Agar koi field predefined list me se ho (jaise `programType: ['ug', 'pg', 'diploma']` ya `status: ['active', 'inactive']`), toh invalid values aane par proper 400 error return karein.
- **Resource Not Found (`404 Not Found`)**: Agar update/delete/get me given ID/Slug database me exist nahi karta ya deleted hai, toh **`404 Not Found`** return karein.
- **Proper Status Codes**:
  - `200 OK`: Successful fetch / update / delete.
  - `201 Created`: Successful creation.
  - `400 Bad Request`: Validation error / invalid input payload.
  - `404 Not Found`: Resource not found.
  - `500 Internal Server Error`: Unexpected server/database exceptions.

