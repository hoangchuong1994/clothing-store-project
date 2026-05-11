import prisma from '@/lib/server/prisma/prisma';
import type { UserRepositoryPort } from '../../application/ports/user.repository';
import type { UserWithCredentialsDTO } from '../../shared/contracts/auth.types';

const mapUserStatus = (
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED',
  emailVerified: Date | null,
): UserWithCredentialsDTO['status'] => {
  if (status === 'ACTIVE' && !emailVerified) {
    return 'PENDING_EMAIL_VERIFICATION';
  }

  if (status === 'ACTIVE') {
    return 'ACTIVE';
  }

  if (status === 'BANNED') {
    return 'SUSPENDED';
  }

  return 'DEACTIVATED';
};

const mapPermissions = (roleName: string | null): UserWithCredentialsDTO['permissions'] => {
  switch (roleName) {
    case 'SUPER_ADMIN':
      return ['MANAGE_USERS', 'VIEW_ORDERS', 'MANAGE_PRODUCTS', 'MANAGE_STORE'];
    case 'ADMIN':
      return ['VIEW_ORDERS', 'MANAGE_PRODUCTS', 'PROCESS_ORDERS'];
    case 'STAFF':
      return ['VIEW_ORDERS', 'PROCESS_ORDERS'];
    case 'SELLER':
      return ['MANAGE_PRODUCTS', 'VIEW_ORDERS', 'MANAGE_SELF_PROFILE'];
    case 'CUSTOMER':
      return ['VIEW_CART', 'CHECKOUT', 'MANAGE_SELF_PROFILE'];
    default:
      return [];
  }
};

export class PrismaUserRepositoryAdapter implements UserRepositoryPort {
  public async findByEmail(email: string): Promise<UserWithCredentialsDTO | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true },
    });

    if (!user || !user.email || !user.password || !user.role) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name ?? '',
      role: user.role.name as UserWithCredentialsDTO['role'],
      permissions: mapPermissions(user.role.name),
      status: mapUserStatus(user.status, user.emailVerified),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      passwordHash: user.password,
    };
  }
}
