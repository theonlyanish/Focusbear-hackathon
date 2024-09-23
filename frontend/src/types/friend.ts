import { User } from './user';

export interface Friend extends User {
  status: 'pending' | 'accepted';
}
