
exports.validateInput = (req, res, next) => {
  const errors = {};

  // Regex to check for dangerous XSS vectors
  // We allow standard HTML (p, div, b, etc.) but block scripts and event handlers.
  
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/igm;
  const scriptTagRegex = /<script\b/i; // Catch standalone <script
  const javascriptProtocolRegex = /javascript:/i;
  const eventHandlerRegex = /\s+on[a-z]+\s*=/i; // Catch onload=, onclick=, etc.

  const hasXSS = (str) => {
    if (!str || typeof str !== 'string') return false;
    return scriptRegex.test(str) || 
           scriptTagRegex.test(str) ||
           javascriptProtocolRegex.test(str) || 
           eventHandlerRegex.test(str);
  };
  
  const hasNoSQLInjection = (obj) => {
    if (obj && typeof obj === 'object') {
        for (const key in obj) {
            if (key.startsWith('$')) {
                return true;
            }
            if (hasNoSQLInjection(obj[key])) {
                return true;
            }
        }
    }
    return false;
  };

  // Check ALL fields in the request body
  if (req.body) {
    if (hasNoSQLInjection(req.body)) {
        return res.status(400).json({
            status: 400,
            message: "Validation failed: Invalid Input (Potential NoSQL Injection)"
        });
    }

    Object.keys(req.body).forEach(key => {
        const value = req.body[key];
        if (typeof value === 'string' && hasXSS(value)) {
            errors[key] = "Input contains invalid content";
        }
    });
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Validation failed: Potential XSS detected",
      errors
    });
  }

  next();
};
