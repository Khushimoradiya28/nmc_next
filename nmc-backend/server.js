require("dotenv").config();

const express = require("express");
const connectDB = require("./src/Config/db");
const Routes = require("./src/Routes");
const authRoutes = require("./src/Routes/authRoutes");
const { encryptResponse } = require("./src/Middleware/encryptResponse");
const { errorHandler } = require("./src/Middleware/errorHandler");
const { verifyToken } = require("./src/Middleware/authMiddleware");
const { validateInput } = require("./src/Middleware/inputValidator");
const config = require("./src/Config/app");
const logger = require("./src/Utils/logger");
const cors = require("cors");
const path = require("path");

const app = express();
app.disable('x-powered-by');


app.use(express.static(path.join(__dirname, "src", "Public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(validateInput);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-is-encrypted"
    );
    return res.sendStatus(204);
  }
  next();
});

connectDB();

if (config.ENCRYPTION_STATUS === "true") {
  app.use(encryptResponse);
}

app.use("/api/auth", authRoutes);

app.use("/api", (req, res, next) => {
  const openPaths = [
    "media",
    "addlead",
    "testimonial",
    "testimonials",
    "certificate-course",
    "certificate-courses",
    "award",
    "awards",
    "academic-program",
    "academic-programs",
    "faculty",
    "faculties",
    "master",
    "banner",
    "banners",
    "gallery",
    "galleries",
    "contact",
    "contact-us",
    "leads",
    "lead",
    "admission",
    "admissions",
    "admission-lead",
    "admission-leads",
    "courses",
    "course",
    "gold-medalist",
    "gold-medalists",
    "achievers",
    "ranker",
    "rankers",
    "top-10",
    "user",
    "role"
  ];

  if (req.method === "GET" || openPaths.some((key) => req.path.toLowerCase().includes(key))) {
    return next();
  }

  return verifyToken(req, res, next);
});

app.use("/api", Routes);

app.use(errorHandler);

app.use("/media", express.static(path.join(__dirname, "src", "media")));
app.use("/uploads", express.static(path.join(__dirname, "src", "media")));
app.use("/api/media", express.static(path.join(__dirname, "src", "media")));
app.use("/api/uploads", express.static(path.join(__dirname, "src", "media")));

app.get("/", (req, res) => {
  res.send("NMC Portal API is running and MongoDB is connected!");
});

const PORT = config.PORT;

app.listen(PORT, "0.0.0.0", () =>
  logger.info(`Server running on http://localhost:${PORT}`)
);
