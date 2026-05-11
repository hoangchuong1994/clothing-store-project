import { loginServerSchema } from '../../shared/validation/login-server.schema';
import type { LoginRequestDTO } from '../dto/login-request.dto';
import type { LoginResponseDTO } from '../dto/login-response.dto';
import type { UserRepositoryPort } from '../ports/user.repository';
import type { SessionRepositoryPort } from '../ports/session.repository';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import type { EventBusPort } from '../ports/event-bus.port';
import type { MetricsPort } from '../ports/metrics.port';
import {
  EmailNotVerifiedError,
  InvalidCredentialsError,
  ValidationError,
} from '../../domain/exceptions/auth.exceptions';
import type { SecurityContext } from '../context/security-context';
import type { RequestContext as SharedRequestContext } from '../context/request-context';
import type { UserWithCredentialsDTO } from '../../shared/contracts/auth.types';

export interface LoginUseCaseDependencies {
  userRepository: UserRepositoryPort;
  sessionRepository: SessionRepositoryPort;
  passwordHasher: PasswordHasherPort;
  eventBus: EventBusPort;
  metrics: MetricsPort;
}

export interface LoginUseCaseContext {
  requestContext: SharedRequestContext;
  securityContext: SecurityContext;
}

export class LoginUseCase {
  constructor(private readonly dependencies: LoginUseCaseDependencies) {}

  public async execute(
    input: LoginRequestDTO,
    context: LoginUseCaseContext,
  ): Promise<LoginResponseDTO> {
    const parsedInput = loginServerSchema.safeParse(input);
    if (!parsedInput.success) {
      throw new ValidationError(
        parsedInput.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      );
    }

    const email = parsedInput.data.email;
    const password = parsedInput.data.password;

    const user = await this.dependencies.userRepository.findByEmail(email);
    if (!user) {
      await this.dependencies.metrics.increment('auth.login.failure', 1, {
        reason: 'user_not_found',
      });
      throw new InvalidCredentialsError();
    }

    const authenticatedUser = user as UserWithCredentialsDTO;

    if (authenticatedUser.status === 'PENDING_EMAIL_VERIFICATION') {
      throw new EmailNotVerifiedError();
    }

    const validPassword = await this.dependencies.passwordHasher.compare(
      password,
      authenticatedUser.passwordHash,
    );

    if (!validPassword) {
      await this.dependencies.metrics.increment('auth.login.failure', 1, {
        reason: 'invalid_password',
      });
      throw new InvalidCredentialsError();
    }

    const session = await this.dependencies.sessionRepository.createSession({
      userId: authenticatedUser.id,
      sessionToken: crypto.randomUUID().replace(/-/g, ''),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    });

    await this.dependencies.eventBus.publish('auth.login.success', {
      userId: authenticatedUser.id,
      sessionId: session.id,
      ipAddress: context.requestContext.ipAddress,
      userAgent: context.requestContext.userAgent,
    });

    await this.dependencies.metrics.increment('auth.login.success', 1, {
      role: authenticatedUser.role,
      userId: authenticatedUser.id,
    });

    return {
      userId: authenticatedUser.id,
      sessionId: session.id,
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt,
    };
  }
}
