import { Module } from '@nestjs/common';
import { UnlockRequestService } from './unlock-request.service';
import { UnlockRequestController } from './unlock-request.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from 'src/notifications/notifications.module';
import { FriendModule } from 'src/friend/friend.module';

@Module({
  imports: [PrismaModule, NotificationModule, FriendModule],
  providers: [UnlockRequestService],
  controllers: [UnlockRequestController],
})
export class UnlockRequestModule {}
