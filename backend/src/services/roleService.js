const Role = require("../models/Role");

class RoleService {
  async createRole(roleData) {
    try {
      const newRole = new Role(roleData);
      return await newRole.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Tên vai trò đã tồn tại.");
      }
      throw error;
    }
  }

  async getAllRoles() {
    return await Role.find().sort({ name: 1 });
  }

  async getRoleById(id) {
    return await Role.findById(id);
  }

  async getRoleByName(name) {
    return await Role.findOne({ name });
  }

  async updateRole(id, updateData) {
    return await Role.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteRole(id) {
    return await Role.findByIdAndDelete(id);
  }

  async updatePermissions(id, permissions) {
    return await Role.findByIdAndUpdate(
      id,
      { permissions },
      { new: true, runValidators: true },
    );
  }

  async addPermission(id, permission) {
    return await Role.findByIdAndUpdate(
      id,
      { $addToSet: { permissions: permission } },
      { new: true },
    );
  }

  async removePermission(id, permission) {
    return await Role.findByIdAndUpdate(
      id,
      { $pull: { permissions: permission } },
      { new: true },
    );
  }
}

module.exports = new RoleService();
