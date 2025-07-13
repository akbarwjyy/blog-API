const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

// Middleware untuk parsing JSON body
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Helmet - set HTTP security headers
app.use(helmet());

// Cookie parser - untuk mengakses cookies
app.use(cookieParser());

// CORS - batasi asal permintaan
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Rate Limiter - batasi 100 request per 15 menit per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // maksimal 100 request
  message: "Terlalu banyak request dari IP ini, coba lagi nanti.",
});
app.use(limiter);

// Body parser
app.use(express.json());

// Koneksi MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
