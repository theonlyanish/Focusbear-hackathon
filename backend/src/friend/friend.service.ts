import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  async getFriends(userId: number) {
    return this.prisma.friend.findMany({
      where: {
        OR: [{ user_id: userId }, { friend_id: userId }],
      },
      include: {
        user: false,
        friend: true,
      },
    });
  }
}
