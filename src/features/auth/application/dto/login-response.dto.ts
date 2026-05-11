export interface LoginResponseDTO {
  userId: string;
  sessionId: string;
  sessionToken?: string;
  expiresAt: string;
  nextUrl?: string;
}
