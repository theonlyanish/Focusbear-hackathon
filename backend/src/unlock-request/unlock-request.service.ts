import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from 'src/notifications/notifications.service';

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

    const unlockRequest = await this.prisma.unlockRequest.create({
      data: {
        user_id: userId,
        reason,
        timePeriod,
        responses: {
          create: user.friendsAsUser.map((friend) => ({
            friend_id: friend.friend_id,
          })),
        },
      },
    });

    return unlockRequest;
  }

  async getUnlockRequestsForFriend(friendId: number) {
    return this.prisma.unlockResponse.findMany({
      where: { friend_id: friendId },
      include: { unlockRequest: true },
    });
  }

  async respondToUnlockRequest(
    unlockRequestId: number,
    friendId: number,
    response: 'accepted' | 'rejected',
  ) {
    await this.prisma.unlockResponse.update({
      where: {
        unlockRequestId_friend_id: {
          unlockRequestId,
          friend_id: friendId,
        },
      },
      data: { response },
    });

    const allResponses = await this.prisma.unlockResponse.findMany({
      where: { unlockRequestId },
    });

    const allAccepted = allResponses.every((r) => r.response === 'accepted');
    const anyRejected = allResponses.some((r) => r.response === 'rejected');

    let newStatus: 'accepted' | 'rejected' | 'pending' = 'pending';
    if (allAccepted) {
      newStatus = 'accepted';
    } else if (anyRejected) {
      newStatus = 'rejected';
    }

    await this.prisma.unlockRequest.update({
      where: { id: unlockRequestId },
      data: { status: newStatus },
    });

    return newStatus;
  }
}
