import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FriendModule } from './friend/friend.module';
import { InviteModule } from './invite/invite.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, InviteModule, FriendModule, UserModule],
})
export class AppModule {}
