import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notifications/notifications.service';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class InviteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async createInvite(userId: number, friendId: number): Promise<void> {
    try {
      // Check if both users exist
      const [user, friend] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: userId } }),
        this.prisma.user.findUnique({ where: { id: friendId } }),
      ]);

      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      if (!friend) {
        throw new NotFoundException(`Friend with id ${friendId} not found`);
      }

      // check if invitation already exist between user & friend
      const existingInvitation = await this.prisma.invitation.findFirst({
        where: {
          OR: [
            { user_id: userId, friend_id: friendId },
            { user_id: friendId, friend_id: userId },
          ],
        },
      });

      if (existingInvitation) {
        throw new ConflictException('Invitation already exists');
      }

      const invitation = await this.prisma.invitation.create({
        data: {
          user_id: userId,
          friend_id: friendId,
          status: 'PENDING',
        },
      });
      console.log('Invite created successfully in database');

      // Send notification to the friend
      await this.notificationService.sendNotification(
        `user-${friendId}`,
        'new-invitation',
        {
          invitationId: invitation.id,
          fromUser: user.id,
          message: `${user.name} has invited you to be their buddy!`,
        },
      );
    } catch (error) {
      console.error('Error in createInvite service:', error);
      throw error;
    }
  }

  async acceptInvite(userId: string, inviteId: string): Promise<void> {
    try {
      const parsedUserId = parseInt(userId, 10);
      const parsedInviteId = parseInt(inviteId, 10);

      const invite = await this.prisma.invitation.findUnique({
        where: { id: parsedInviteId },
        include: { user: true },
      });

      if (!invite) {
        throw new NotFoundException(`Invite with id ${inviteId} not found`);
      }

      if (invite.friend_id !== parsedUserId) {
        throw new UnauthorizedException(
          'You are not authorized to accept this invite',
        );
      }

      await this.prisma.invitation.update({
        where: { id: parsedInviteId },
        data: { status: 'ACCEPTED' },
      });

      await this.prisma.friend.create({
        data: {
          user_id: invite.user_id,
          friend_id: invite.friend_id,
          invitation_id: invite.id,
        },
      });

      // Get the acceptor's name
      const acceptor = await this.prisma.user.findUnique({
        where: { id: parsedUserId },
        select: { name: true },
      });

      if (!acceptor) {
        throw new NotFoundException(`User with id ${parsedUserId} not found`);
      }

      // Send notification to the user who sent the invite
      await this.notificationService.sendNotification(
        `user-${invite.user_id}`,
        'invitation-accepted',
        {
          invitationId: parsedInviteId,
          acceptedBy: parsedUserId,
          message: `Your buddy invitation has been accepted by ${acceptor.name}`,
        },
      );
    } catch (error) {
      console.error('Error in acceptInvite service:', error);
      throw error;
    }
  }

  // async getInvites(userId: number) {
  //   return this.prisma.invitation.findMany({
  //     where: {
  //       friend_id: userId,
  //       status: 'PENDING'
  //     },
  //     include: {
  //       user: true
  //     }
  //   });
  // }
  async getInvites(userId: number) {
    return this.prisma.invitation.findMany({
      where: {
        friend_id: userId,
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async rejectInvite(userId: string, inviteId: string): Promise<void> {
    try {
      const parsedUserId = parseInt(userId, 10);
      const parsedInviteId = parseInt(inviteId, 10);

      const invite = await this.prisma.invitation.findUnique({
        where: { id: parsedInviteId },
      });

      if (!invite) {
        throw new NotFoundException(`Invite with id ${inviteId} not found`);
      }

      if (invite.friend_id !== parsedUserId) {
        throw new UnauthorizedException(
          'You are not authorized to reject this invite',
        );
      }

      await this.prisma.invitation.update({
        where: { id: parsedInviteId },
        data: { status: 'REJECTED' },
      });

      // Optionally, send a notification to the user who sent the invite
    } catch (error) {
      console.error('Error in rejectInvite service:', error);
      throw error;
    }
  }
}
