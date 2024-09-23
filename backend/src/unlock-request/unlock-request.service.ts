import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notifications/notifications.service';
import { Friend, UnlockRequest, User } from '@prisma/client';
import { LockStatus } from '@prisma/client';

@Injectable()
export class UnlockRequestService {
  constructor(private readonly notificationService: NotificationService, private prisma: PrismaService) {}

  async createUnlockRequest(
    userId: number,
    reason: string,
    timePeriod: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { friendsAsUser: true },
    });

    if (!user) {
      throw new Error('User not found');
    }
    // check if request has been made before with the same reason and time period within 5 hours
    const existingRequest = await this.prisma.unlockRequest.findFirst({
      where: {
        user_id: userId,
        reason,
        timePeriod,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 60 * 1000),
        },
      },
    });

    if (existingRequest) {
      throw new BadRequestException(
        'A similar unlock request has already been made within the last 5 hours',
      );
    }

    const unlockRequest = await this.prisma.$transaction(async (prisma) => {
      //transaction to make sure it runs & fails together as one transaction
      const request = await prisma.unlockRequest.create({
        data: {
          user_id: userId,
          reason,
          timePeriod,
        },
      });

      console.log('request created', request);
      return request;
    });

    await this.prisma.unlockResponse.createMany({
      data: user.friendsAsUser.map((friend) => ({
        unlockRequestId: unlockRequest.id,
        friend_id: friend.friend_id,
      })),
    });

    // send notification to all friends
    await this.sendUnlockRequestNotificationsToFriends(
      unlockRequest,
      user,
      user.friendsAsUser,
    );

    return unlockRequest;
  }

  async getUnlockRequestsForFriend(friendId: number) {
    return this.prisma.unlockResponse.findMany({
      where: { friend_id: friendId },
      include: {
        unlockRequest: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
    });
  }

  async sendUnlockRequestNotificationsToFriends(
    unlockRequest: UnlockRequest,
    user: User,
    friends: Friend[],
  ) {
    for (const friend of friends) {
      await this.notificationService.sendNotification(
        `user-${friend.friend_id}`,
        'new-unlock-request',
        {
          unlockRequestId: unlockRequest.id,
          fromUser: user.id,
          userName: user.name,
          reason: unlockRequest.reason,
          timePeriod: unlockRequest.timePeriod,
          message: `Your friend ${user.name} has requested to unlock their phone for ${unlockRequest.timePeriod} minutes`,
        },
      );
    }
  }

  async getLockStatus(userId: number) {
    let lockStatus = await this.prisma.lockStatus.findUnique({
      where: { userId },
    });

    if (!lockStatus) {
      // If no lock status exists, create one with default values
      lockStatus = await this.prisma.lockStatus.create({
        data: { userId, isLocked: true },
      });
    }

    const currentTime = new Date();

    if (!lockStatus.isLocked && lockStatus.unlockedUntil) {
      if (currentTime > lockStatus.unlockedUntil) {
        // Lock period has ended, update status
        lockStatus = await this.prisma.lockStatus.update({
          where: { userId },
          data: { isLocked: true, unlockedUntil: null },
        });
      }
    }

    return {
      isLocked: lockStatus.isLocked,
      remainingTime: lockStatus.unlockedUntil && !lockStatus.isLocked
        ? Math.max(0, Math.floor((lockStatus.unlockedUntil.getTime() - currentTime.getTime()) / 1000))
        : 0,
    };
  }

  async updateLockStatus(userId: number, isLocked: boolean, unlockedUntil?: Date) {
    try {
      const updatedLockStatus = await this.prisma.lockStatus.upsert({
        where: { userId },
        update: { isLocked, unlockedUntil },
        create: { userId, isLocked, unlockedUntil },
      });
      console.log('Lock status updated successfully:', updatedLockStatus);
      return updatedLockStatus;
    } catch (error) {
      console.error('Error updating lock status:', error);
      throw new Error('Failed to update lock status');
    }
  }

  async respondToUnlockRequest(
    unlockRequestId: number,
    friendId: number,
    response: 'accepted' | 'rejected',
  ) {
    // update the unlock response
    await this.prisma.unlockResponse.update({
      where: {
        unlockRequestId_friend_id: {
          unlockRequestId,
          friend_id: friendId,
        },
      },
      data: { response },
    });

    // get all responses for the unlock request
    const allResponses = await this.prisma.unlockResponse.findMany({
      where: { unlockRequestId },
    });

    // check if all responses are accepted
    const allAccepted = allResponses.every((r) => r.response === 'accepted');
    const anyRejected = allResponses.some((r) => r.response === 'rejected');

    // send notification to the user who made the request
    let newStatus: 'accepted' | 'rejected' | 'pending' = 'pending';
    if (allAccepted) {
      newStatus = 'accepted';
    } else if (anyRejected) {
      newStatus = 'rejected';
    }

    const updatedUnlockRequest = await this.prisma.unlockRequest.update({
      where: { id: unlockRequestId },
      data: { status: newStatus },
    });

    // get the user who made the request
    const unlockRequest = await this.prisma.unlockRequest.findUnique({
      where: { id: unlockRequestId },
      include: { user: true },
    });
    const user = unlockRequest.user;

    // get the friend who get the request
    const friend = await this.prisma.user.findUnique({
      where: { id: friendId },
    });

    console.log('user', user);
    console.log('friend', friend);

    // send notification to the user who made the request
    await this.notificationService.sendNotification(
      `user-${user.id}`,
      'unlock-request-response',
      {
        unlockRequestId,
        friendId,
        response,
        message: `Your friend ${friend.name} has ${
          response === 'accepted' ? 'accepted' : 'rejected'
        } your unlock request`,
      },
    );

    if (newStatus === 'accepted') {
      const currentTime = new Date();
      const unlockedUntil = new Date(currentTime.getTime() + updatedUnlockRequest.timePeriod * 1000);
      await this.updateLockStatus(updatedUnlockRequest.user_id, false, unlockedUntil);
    }

    return newStatus;
  }
}
