import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { UnlockRequestModule } from './unlock-request/unlock-request.module';
import { FriendModule } from './friend/friend.module';
import { InviteModule } from './invite/invite.module';

@Module({
  imports: [
    UserModule,
    FriendModule,
    InviteModule,
    PrismaModule,
    UnlockRequestModule,
  ],
})
export class AppModule {}
