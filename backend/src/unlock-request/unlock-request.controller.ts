import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { UnlockRequestService } from './unlock-request.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('unlock requests')
@Controller('unlocks')
export class UnlockRequestController {
  constructor(private readonly unlockRequestService: UnlockRequestService) {}

  @Post()
  async createUnlockRequest(
    @Body() body: { userId: number; reason: string; timePeriod: number },
  ) {
    return this.unlockRequestService.createUnlockRequest(
      body.userId,
      body.reason,
      body.timePeriod,
    );
  }

  @Get('requests')
  async getUnlockRequestsForFriend(@Body() body: { friendId: number }) {
    return this.unlockRequestService.getUnlockRequestsForFriend(body.friendId);
  }

  @Post(':unlockRequestId/accept')
  async acceptUnlockRequest(
    @Param('unlockRequestId') unlockRequestId: string,
    @Body() body: { friendId: number },
  ) {
    return this.unlockRequestService.respondToUnlockRequest(
      parseInt(unlockRequestId),
      body.friendId,
      'accepted',
    );
  }

  @Post(':unlockRequestId/reject')
  async rejectUnlockRequest(
    @Param('unlockRequestId') unlockRequestId: string,
    @Body() body: { friendId: number },
  ) {
    return this.unlockRequestService.respondToUnlockRequest(
      parseInt(unlockRequestId),
      body.friendId,
      'rejected',
    );
  }
}
