export interface ITokenPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}
