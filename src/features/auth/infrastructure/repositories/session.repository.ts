import prisma from '@/lib/server/prisma/prisma';
import type { SessionDTO } from '../../shared/contracts/auth.types';
import { DatabaseError } from '../../domain/exceptions/auth.exceptions';

export class PrismaSessionRepository {
  public async createSession(
    session: Omit<SessionDTO, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SessionDTO> {
    try {
      const created = await prisma.session.create({
        data: {
          userId: session.userId,
          sessionToken: session.sessionToken,
          expires: new Date(session.expiresAt),
        },
      });

      return {
        id: created.id,
        userId: created.userId,
        sessionToken: created.sessionToken,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
        expiresAt: created.expires.toISOString(),
      };
    } catch (error) {
      console.error('Error creating session:', error);
      throw new DatabaseError('Failed to create session');
    }
  }
}
