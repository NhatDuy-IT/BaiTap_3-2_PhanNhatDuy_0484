const Role = require("../models/Role");

// [POST] /api/roles - Tạo role mới
const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = new Role({ name, description });
    await role.save();
    res.status(201).json({ message: "Tạo role thành công", data: role });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Tên role đã tồn tại" });
    }
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// [GET] /api/roles - Lấy tất cả roles (chưa bị xoá mềm)
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.status(200).json({ message: "Lấy danh sách role thành công", data: roles });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// [GET] /api/roles/:id - Lấy role theo id
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) {
      return res.status(404).json({ message: "Không tìm thấy role" });
    }
    res.status(200).json({ message: "Lấy role thành công", data: role });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// [PUT] /api/roles/:id - Cập nhật role
const updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { name, description },
      { new: true, runValidators: true }
    );
    if (!role) {
      return res.status(404).json({ message: "Không tìm thấy role" });
    }
    res.status(200).json({ message: "Cập nhật role thành công", data: role });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Tên role đã tồn tại" });
    }
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// [DELETE] /api/roles/:id - Xoá mềm role
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!role) {
      return res.status(404).json({ message: "Không tìm thấy role" });
    }
    res.status(200).json({ message: "Xoá role thành công (xoá mềm)", data: role });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { createRole, getAllRoles, getRoleById, updateRole, deleteRole };

