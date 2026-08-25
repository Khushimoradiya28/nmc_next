# BACKEND PROJECT GLOBAL RULES FOR AI AGENTS

1. ARCHITECTURE PATTERN:
   - Always follow the existing project structure (Controllers, Routes, Models, Middleware).
   - DO NOT invent new folder structures or architecture patterns.

2. NO UNNECESSARY EXTRA FILES:
   - DO NOT create unnecessary helper, utility, or extra summary markdown files unless requested.
   - Keep files consolidated and maintainable.

3. PRODUCTION READY API DESIGN:
   - Always include proper request validation, error handling, try-catch blocks, and clean HTTP status codes (200, 201, 400, 404, 500).
   - All MongoDB models must include `{ timestamps: true }`.

4. DYNAMIC ENUM / CATEGORIZATION:
   - When handling section variations (e.g. Dignitary vs Student Testimonials), use a unified Schema with a `type` or `category` field rather than duplicating models.