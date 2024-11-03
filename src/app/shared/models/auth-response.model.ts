import { User } from 'src/app/shared';

export interface AuthResponse {
  accessToken: string;
  user: User;
}
