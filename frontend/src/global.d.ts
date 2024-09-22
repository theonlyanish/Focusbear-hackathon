declare global {
  var currentUser: {
    id: number;
    name: string;
    email: string;
  };
}

export {};
// Extending the global namespace to include additional types

// Define a User type
interface User {
  id: number;
  name: string;
  email: string;
}

// Define an UnlockRequest type
interface UnlockRequest {
  id: number;
  userId: number;
  reason: string;
  timePeriod: number;
  status: 'pending' | 'accepted' | 'rejected';
}

// Define a Friend type
interface Friend {
  id: number;
  name: string;
  email: string;
}

// Define an Invite type
interface Invite {
  id: number;
  userId: number;
  friendId: number;
  status: 'pending' | 'accepted' | 'rejected';
}

// Extend the global namespace
declare global {
  // Extend the existing currentUser
  var currentUser: User;

  // Add new global variables
  var friends: Friend[];
  var pendingInvites: Invite[];
  var unlockRequests: UnlockRequest[];
}
