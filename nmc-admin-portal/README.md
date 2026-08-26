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
