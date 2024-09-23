import { User } from './user';

export interface UnlockRequest {
  id: number;
  user?: User; 
  reason: string;
  timePeriod: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
