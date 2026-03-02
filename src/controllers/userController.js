const User = require("../models/User");

// [POST] /api/users - Tạo user mới
const createUser = async (req, res) => {
  try {
    const { username, password, email, fullName, avatarUrl, role } = req.body;
    const user = new User({ username, password, email, fullName, avatarUrl, role });
    await user.save();
    const result = user.toObject();
    delete result.password;
    res.status(201).json({ message: "Tạo user thành công", data: result });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} đã tồn tại` });
    }
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// [GET] /api/users - Lấy tất cả users (chưa bị xoá mềm)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .select("-password")
      .populate("role", "name description");
    res.status(200).json({ message: "Lấy danh sách user thành công", data: users });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// [GET] /api/users/:id - Lấy user theo id
const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false })
      .select("-password")
      .populate("role", "name description");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.status(200).json({ message: "Lấy user thành công", data: user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// [PUT] /api/users/:id - Cập nhật user
const updateUser = async (req, res) => {
  try {
    const { fullName, avatarUrl, role, loginCount } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { fullName, avatarUrl, role, loginCount },
      { new: true, runValidators: true }
    )
      .select("-password")
      .populate("role", "name description");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.status(200).json({ message: "Cập nhật user thành công", data: user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// [DELETE] /api/users/:id - Xoá mềm user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.status(200).json({ message: "Xoá user thành công (xoá mềm)", data: user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// [POST] /api/users/enable - Bật tài khoản (status = true)
const enableUser = async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: "Vui lòng cung cấp email và username" });
    }
    const user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: true },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Thông tin email hoặc username không đúng" });
    }
    res.status(200).json({ message: "Kích hoạt tài khoản thành công", data: user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// [POST] /api/users/disable - Tắt tài khoản (status = false)
const disableUser = async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: "Vui lòng cung cấp email và username" });
    }
    const user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: false },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Thông tin email hoặc username không đúng" });
    }
    res.status(200).json({ message: "Vô hiệu hoá tài khoản thành công", data: user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser, enableUser, disableUser };

