import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InviteService {
  constructor(private readonly prisma: PrismaService) {}

  async createInvite(userId: number, friendId: number): Promise<void> {
    try {
      console.log(`Attempting to create invite for userId: ${userId}, friendId: ${friendId}`);
      
      // Check if both users exist
      const [user, friend] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: userId } }),
        this.prisma.user.findUnique({ where: { id: friendId } }),
      ]);

      if (!user || !friend) {
        console.error(`User or friend not found. userId: ${userId}, friendId: ${friendId}`);
        throw new Error('User or friend not found');
      }

      // Create the invitation
      await this.prisma.invitation.create({
        data: {
          user_id: userId,
          friend_id: friendId,
          status: 'PENDING',
        },
      });
      
      console.log('Invite created successfully');
    } catch (error) {
      console.error('Error in createInvite:', error);
      throw error;
    }
  }

  async acceptInvite(userId: number, inviteId: number): Promise<void> {
    const invite = await this.prisma.invitation.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new NotFoundException('Invitation not found');
    }

    if (invite.friend_id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to accept this invite',
      );
    }

    await this.prisma.invitation.update({
      where: { id: inviteId },
      data: { status: 'accepted' },
    });

    await this.prisma.friend.create({
      data: {
        user_id: invite.user_id,
        friend_id: invite.friend_id,
        invitation_id: invite.id,
      },
    });
  }

  async getInvites(userId: number) {
    return this.prisma.invitation.findMany({
      where: {
        OR: [{ user_id: userId }, { friend_id: userId }],
      },
    });
  }
}
