const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");

const app = express();

// Middleware parse JSON
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => {
    console.error("❌ Lỗi kết nối MongoDB:", err.message);
    process.exit(1);
  });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);

// Route mặc định
app.get("/", (req, res) => {
  res.json({ message: "API đang hoạt động!" });
});

// Xử lý route không tồn tại
app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy đường dẫn này" });
});

// Khởi chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

