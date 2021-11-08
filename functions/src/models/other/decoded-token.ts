export interface DecodedToken {
  aud: string;
  uid: string;
  email: string;
  iss: string;
  sub: string;
  iat: number;
  exp: number;
}
