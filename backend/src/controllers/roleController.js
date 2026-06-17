const roleService = require("../services/roleService");

class RoleController {
  async create(req, res) {
    try {
      const role = await roleService.createRole(req.body);
      res.status(201).json({ success: true, data: role });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const roles = await roleService.getAllRoles();
      res.status(200).json({ success: true, data: roles });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const role = await roleService.getRoleById(req.params.id);
      if (!role) {
        return res
          .status(404)
          .json({ success: false, message: "Vai trò không tồn tại." });
      }
      res.status(200).json({ success: true, data: role });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByName(req, res) {
    try {
      const role = await roleService.getRoleByName(req.params.name);
      if (!role) {
        return res
          .status(404)
          .json({ success: false, message: "Vai trò không tồn tại." });
      }
      res.status(200).json({ success: true, data: role });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const role = await roleService.updateRole(req.params.id, req.body);
      if (!role) {
        return res
          .status(404)
          .json({ success: false, message: "Vai trò không tồn tại." });
      }
      res.status(200).json({ success: true, data: role });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const role = await roleService.deleteRole(req.params.id);
      if (!role) {
        return res
          .status(404)
          .json({ success: false, message: "Vai trò không tồn tại." });
      }
      res
        .status(200)
        .json({ success: true, message: "Xóa vai trò thành công." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updatePermissions(req, res) {
    try {
      const { permissions } = req.body;
      const role = await roleService.updatePermissions(
        req.params.id,
        permissions,
      );
      res.status(200).json({ success: true, data: role });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async addPermission(req, res) {
    try {
      const { permission } = req.body;
      const role = await roleService.addPermission(req.params.id, permission);
      res.status(200).json({ success: true, data: role });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async removePermission(req, res) {
    try {
      const { permission } = req.body;
      const role = await roleService.removePermission(
        req.params.id,
        permission,
      );
      res.status(200).json({ success: true, data: role });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new RoleController();
