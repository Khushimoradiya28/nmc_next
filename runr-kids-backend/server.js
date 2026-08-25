const express = require("express");
const dotenv = require("dotenv");
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
const { scheduleDailyReport } = require("./src/Cron/cronJobs");

// Initialize Cron Jobs
scheduleDailyReport();

dotenv.config();

app.use(express.static(path.join(__dirname, "src", "Public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(validateInput);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.includes("localhost") || 
      origin.includes("127.0.0.1") ||
      origin.includes("runr-kids.web.app") ||
      origin.includes("runr-kids-portal.vercel.app") ||
      origin.includes("https://runrkids.in") ||
      origin.includes("https://uat.runrkids.in")
    ) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
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
    "list",
    "productlist",
    "media",
    "wishlist",
    "cart",
    "updatevisitor",
    "remove",
    "homeproductlist",
    "searchproduct",
    "addlead",
    "bulk-import-images",
    "bulk-import-prices",
    "updateproductseo",
    "get-reviews"
  ];

  if (openPaths.some((key) => req.path.toLowerCase().includes(key))) {
    return next();
  }

  return verifyToken(req, res, next);
});

app.use("/api", Routes);

app.use(errorHandler);

app.use("/media", express.static("src/media"));

app.get("/", (req, res) => {
  res.send("API is running and MongoDB is connected!");
});

const PORT = config.PORT;
app.listen(PORT, "0.0.0.0", () =>
  logger.info(`Server running on http://localhost:${PORT}`)
);

console.log("NODE_ENV =", config.NODE_ENV);
logger.info("MongoDB Connected:", config.NODE_ENV);
