import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationModule } from 'src/notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [InviteService],
  controllers: [InviteController],
})
export class InviteModule {}
