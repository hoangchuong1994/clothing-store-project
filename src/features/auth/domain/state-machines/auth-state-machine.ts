export type AuthSessionState = 'ANONYMOUS' | 'AUTHENTICATED' | 'LOCKED' | 'SUSPENDED' | 'EXPIRED';

export interface AuthStateTransition {
  from: AuthSessionState;
  to: AuthSessionState;
  timestamp: string;
  reason?: string;
}

export const authStateMachine = {
  transitions: {
    signIn: { from: ['ANONYMOUS'], to: 'AUTHENTICATED' as const },
    signOut: { from: ['AUTHENTICATED'], to: 'ANONYMOUS' as const },
    lock: { from: ['AUTHENTICATED'], to: 'LOCKED' as const },
    suspend: { from: ['AUTHENTICATED', 'LOCKED'], to: 'SUSPENDED' as const },
    expire: { from: ['AUTHENTICATED'], to: 'EXPIRED' as const },
  },

  canTransition(current: AuthSessionState, next: AuthSessionState) {
    return Object.values(this.transitions).some(
      (transition) => transition.from.includes(current) && transition.to === next,
    );
  },
};
