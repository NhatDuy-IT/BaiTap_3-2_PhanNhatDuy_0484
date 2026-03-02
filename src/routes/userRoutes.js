const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  enableUser,
  disableUser,
} = require("../controllers/userController");

router.post("/enable", enableUser);    // Kích hoạt tài khoản
router.post("/disable", disableUser);  // Vô hiệu hoá tài khoản
router.post("/", createUser);          // Tạo user
router.get("/", getAllUsers);           // Lấy tất cả users
router.get("/:id", getUserById);       // Lấy user theo id
router.put("/:id", updateUser);        // Cập nhật user
router.delete("/:id", deleteUser);     // Xoá mềm user

module.exports = router;

