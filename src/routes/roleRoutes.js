const express = require("express");
const router = express.Router();
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");

router.post("/", createRole);         // Tạo role
router.get("/", getAllRoles);          // Lấy tất cả roles
router.get("/:id", getRoleById);      // Lấy role theo id
router.put("/:id", updateRole);       // Cập nhật role
router.delete("/:id", deleteRole);    // Xoá mềm role

module.exports = router;

