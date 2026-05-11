import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { PrismaSessionRepository } from '../repositories/session.repository';
import { PrismaUserRepositoryAdapter } from '../repositories/user.repository.adapter';
import { BcryptPasswordHasherAdapter } from '../security/bcrypt-password-hasher.adapter';
import { NoopEventBusAdapter } from '../telemetry/noop-event-bus.adapter';
import { NoopMetricsAdapter } from '../telemetry/noop-metrics.adapter';

export function loginUseCaseFactory() {
  return new LoginUseCase({
    userRepository: new PrismaUserRepositoryAdapter(),
    sessionRepository: new PrismaSessionRepository(),
    passwordHasher: new BcryptPasswordHasherAdapter(),
    eventBus: new NoopEventBusAdapter(),
    metrics: new NoopMetricsAdapter(),
  });
}
