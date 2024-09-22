import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { UnlockRequestModule } from './unlock-request/unlock-request.module';
import { FriendModule } from './friend/friend.module';
import { InviteModule } from './invite/invite.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    FriendModule,
    InviteModule,
    PrismaModule,
    UnlockRequestModule,
    NotificationModule,
  ],
})
export class AppModule {}
