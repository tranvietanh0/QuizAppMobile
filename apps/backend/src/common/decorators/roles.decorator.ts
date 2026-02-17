import { SetMetadata } from "@nestjs/common";
import { Role } from "@prisma/client";

export const ROLES_KEY = "roles";

/**
 * Decorator to set required roles for a route
 * Usage: @Roles(Role.ADMIN)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Shorthand decorator for admin-only routes
 * Usage: @AdminOnly()
 */
export const AdminOnly = () => Roles(Role.ADMIN);
