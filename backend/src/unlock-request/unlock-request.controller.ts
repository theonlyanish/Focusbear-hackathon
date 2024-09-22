import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { UnlockRequestService } from './unlock-request.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('unlock requests')
@Controller('unlocks')
export class UnlockRequestController {
  constructor(private readonly unlockRequestService: UnlockRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new unlock request' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        reason: { type: 'string' },
        timePeriod: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The unlock request has been successfully created.',
  })
  async createUnlockRequest(
    @Body() body: { userId: number; reason: string; timePeriod: number },
  ) {
    return this.unlockRequestService.createUnlockRequest(
      body.userId,
      body.reason,
      body.timePeriod,
    );
  }

  @Get('requests/:friendId')
  @ApiOperation({
    summary: 'Retrieve unlock requests from friends (as a buddy)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of unlock requests for my friends.',
  })
  @ApiParam({ name: 'friendId', type: 'number' })
  async getUnlockRequestsForFriend(@Param('friendId') friendId: string) {
    return this.unlockRequestService.getUnlockRequestsForFriend(
      parseInt(friendId, 10),
    );
  }

  @Post(':unlockRequestId/accept')
  @ApiOperation({ summary: 'Accept an unlock request' })
  @ApiParam({ name: 'unlockRequestId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        friendId: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The unlock request has been successfully accepted.',
  })
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
  @ApiOperation({ summary: 'Reject an unlock request' })
  @ApiParam({ name: 'unlockRequestId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        friendId: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The unlock request has been successfully rejected.',
  })
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
