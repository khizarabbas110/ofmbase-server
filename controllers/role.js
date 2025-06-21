import RoleModel from "../models/role.js";

export const createOrUpdateRole = async (req, res) => {
  try {
    const { id: ownerId } = req.params;
    const { roleId, roleName, rolePermissionModules } = req.body;

    if (!roleName || !Array.isArray(rolePermissionModules)) {
      return res.status(400).json({
        success: false,
        message: "Role name and permissions are required.",
      });
    }

    let role;

    if (roleId) {
      // Update existing role
      role = await RoleModel.findByIdAndUpdate(
        roleId,
        {
          roleName,
          rolePermissionModules,
          ownerId,
        },
        { new: true }
      );

      if (!role) {
        return res.status(404).json({
          success: false,
          message: "Role not found for updating.",
        });
      }
    } else {
      // Check for duplicate name on creation
      const existingRole = await RoleModel.findOne({ roleName, ownerId });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: "Role with this name already exists.",
        });
      }

      // Create new role
      role = new RoleModel({
        roleName,
        rolePermissionModules,
        ownerId,
      });

      await role.save();
    }

    res.status(200).json({
      success: true,
      message: roleId
        ? "Role updated successfully."
        : "Role created successfully.",
      data: role,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A role with this name already exists for this owner.",
      });
    }

    console.error("Error creating/updating role:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving role.",
    });
  }
};

export const getRolesByOwnerId = async (req, res) => {
  const { id } = req.params;
  const MODULES = [
    "Dashboard",
    "Creators",
    "Employees",
    "TimeTracking",
    "Payments",
    "Bonuses",
    "Tasks",
    "Library",
    "Marketing",
    "Costumes",
    "Financials",
    "documents",
    "Receipts",
    "Invoices",
    "Credentials",
    "Settings",
  ];
  try {
    const roles = await RoleModel.find({ ownerId: id }).sort({ createdAt: -1 });

    // Format the roles as expected by the frontend
    const formattedRoles = roles.map((role) => ({
      id: role._id,
      name: role.roleName,
      permissions: MODULES.reduce((acc, module) => {
        acc[module] = role.rolePermissionModules.includes(module.toLowerCase());
        return acc;
      }, {}),
    }));

    res.status(200).json({
      success: true,
      message: `Roles for owner ${id} fetched successfully.`,
      data: formattedRoles,
    });
  } catch (error) {
    console.error("Error fetching roles by owner ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching roles.",
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: "Role ID is required for deletion.",
      });
    }

    const deletedRole = await RoleModel.findByIdAndDelete(roleId);

    if (!deletedRole) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Role deleted successfully.",
      data: deletedRole,
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting role.",
    });
  }
};

export const getRolesOfAnAgency = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: "Owner ID is required.",
      });
    }

    const roles = await RoleModel.find({ ownerId });

    res.status(200).json({
      success: true,
      message: `Roles for owner ${ownerId} fetched successfully.`,
      data: roles,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching roles.",
    });
  }
};
