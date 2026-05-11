export type AuthLifecycleState =
  | 'UNREGISTERED'
  | 'PENDING_EMAIL_VERIFICATION'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'DEACTIVATED';

export type AuthLifecycleEvent =
  | 'REGISTERED'
  | 'EMAIL_VERIFIED'
  | 'SUSPENDED'
  | 'RESTORED'
  | 'DEACTIVATED';

const stateTransitions: Record<
  AuthLifecycleState,
  Partial<Record<AuthLifecycleEvent, AuthLifecycleState>>
> = {
  UNREGISTERED: {
    REGISTERED: 'PENDING_EMAIL_VERIFICATION',
  },
  PENDING_EMAIL_VERIFICATION: {
    EMAIL_VERIFIED: 'ACTIVE',
    DEACTIVATED: 'DEACTIVATED',
  },
  ACTIVE: {
    SUSPENDED: 'SUSPENDED',
    DEACTIVATED: 'DEACTIVATED',
  },
  SUSPENDED: {
    RESTORED: 'ACTIVE',
    DEACTIVATED: 'DEACTIVATED',
  },
  DEACTIVATED: {},
};

export function canTransition(state: AuthLifecycleState, event: AuthLifecycleEvent): boolean {
  return Boolean(stateTransitions[state]?.[event]);
}

export function transitionState(
  state: AuthLifecycleState,
  event: AuthLifecycleEvent,
): AuthLifecycleState {
  const nextState = stateTransitions[state]?.[event];
  if (!nextState) {
    throw new Error(`Invalid auth state transition ${state} -> ${event}`);
  }
  return nextState;
}
