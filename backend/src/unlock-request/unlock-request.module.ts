import { Module } from '@nestjs/common';
import { UnlockRequestService } from './unlock-request.service';
import { UnlockRequestController } from './unlock-request.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from 'src/notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [UnlockRequestService],
  controllers: [UnlockRequestController],
})
export class UnlockRequestModule {}
