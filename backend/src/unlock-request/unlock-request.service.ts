import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from 'src/notifications/notifications.service';
import { Friend, UnlockRequest, User } from '@prisma/client';

@Injectable()
export class UnlockRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

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
      include: { unlockRequest: true },
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

    let newStatus: 'accepted' | 'rejected' | 'pending' = 'pending';
    if (allAccepted) {
      newStatus = 'accepted';
    } else if (anyRejected) {
      newStatus = 'rejected';
    }

    // update the unlock request status
    await this.prisma.unlockRequest.update({
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

    return newStatus;
  }
}
