export const createRoleValidation = {
  roleName: {
    required: true,
    type: String,
    message: "Role name is required",
  },
  rolePermissionModules: {
    required: true,
    type: Array,
    message: "At least one permission is required",
  },
};
