import type {
  AuthPermissionCode,
  AuthRoleCode,
  UserStatus,
} from '../../shared/contracts/auth.types';

export interface AuthUserProps {
  id: string;
  email: string;
  name: string;
  role: AuthRoleCode;
  permissions: AuthPermissionCode[];
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export class AuthUserAggregate {
  constructor(private props: AuthUserProps) {}

  public get id(): string {
    return this.props.id;
  }

  public get status(): UserStatus {
    return this.props.status;
  }

  public get permissions(): AuthPermissionCode[] {
    return this.props.permissions;
  }

  public markEmailVerified(): void {
    if (this.props.status !== 'PENDING_EMAIL_VERIFICATION') {
      throw new Error('Invalid state transition: expected pending verification');
    }
    this.props.status = 'ACTIVE';
    this.props.emailVerified = true;
    this.props.updatedAt = new Date().toISOString();
  }

  public suspend(): void {
    this.props.status = 'SUSPENDED';
    this.props.updatedAt = new Date().toISOString();
  }

  public restore(): void {
    if (this.props.status !== 'SUSPENDED') {
      throw new Error('Invalid state transition: expected suspended state');
    }
    this.props.status = 'ACTIVE';
    this.props.updatedAt = new Date().toISOString();
  }

  public toDTO(): AuthUserProps {
    return { ...this.props };
  }
}
