import { Module } from '@nestjs/common';
import { UnlockRequestService } from './unlock-request.service';
import { UnlockRequestController } from './unlock-request.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UnlockRequestService],
  controllers: [UnlockRequestController],
})
export class UnlockRequestModule {}
