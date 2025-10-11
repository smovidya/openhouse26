import { roles } from "./permissions";

export function hasOneOfRoleIn(
  user: { role?: string | null | undefined } | null,
  roleList: (keyof typeof roles)[],
) {
  if (!user) return false;
  const userRoles = user.role?.split(",") || [];
  return roleList.some((role) => userRoles.includes(role));
}
