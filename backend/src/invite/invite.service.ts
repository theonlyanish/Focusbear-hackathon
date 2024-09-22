import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notifications/notifications.service';

@Injectable()
export class InviteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async createInvite(userId: number, friendId: number): Promise<void> {
    // Check if both users exist
    const [user, friend] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.user.findUnique({ where: { id: friendId } }),
    ]);

    if (!user || !friend) {
      throw new Error('User or friend not found');
    }
      if (!user)
        throw new NotFoundException(`User with id ${userId} not found`);
      if (!friend)
        throw new NotFoundException(`Friend with id ${friendId} not found`);

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
          message: `${user.name} has invited you to be thier buddy !`,
        },
      );
    } catch (error) {
      console.error('Error in createInvite service:', error);
      throw error;
    }
  }

  async acceptInvite(userId: string, inviteId: string): Promise<void> {
    const parsedUserId = parseInt(userId, 10);
    const parsedInviteId = parseInt(inviteId, 10);

    const invite = await this.prisma.invitation.findUnique({
      where: { id: parsedInviteId },
      include: { user: true },
    });

    if (!invite) {
      throw new NotFoundException('Invitation not found');
    }

    if (invite.friend_id !== parsedUserId) {
      throw new UnauthorizedException(
        'You are not authorized to accept this invite',
      );
    }

    await this.prisma.invitation.update({
      where: { id: parsedInviteId },
      data: { status: 'accepted' },
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
  }

  async getInvites(userId: number) {
    return this.prisma.invitation.findMany({
      where: {
        OR: [{ user_id: userId }, { friend_id: userId }],
      },
    });
  }
}
