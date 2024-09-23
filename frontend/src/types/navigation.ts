import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UnlockRequest } from './unlockRequest';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  EmergencyUnlock: undefined;
  UnlockRequestDetail: { request: UnlockRequest };
  LockScreen: {
    pendingRequest?: {
      reason: string;
      duration: number;
    };
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type RoutePropType<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
