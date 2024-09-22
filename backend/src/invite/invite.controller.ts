import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { InviteService } from './invite.service';

@ApiTags('invites')
@Controller('invites')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an invitation' })
  @ApiBody({ schema: { example: { userId: 1, friendId: 2 } } })
  async createInvite(
    @Body('userId') userId: number,
    @Body('friendId') friendId: number,
  ): Promise<void> {
    await this.inviteService.createInvite(userId, friendId); // and send notification
  }

  @Post(':inviteId/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept an invitation' })
  @ApiParam({ name: 'inviteId', type: 'string' })
  @ApiBody({ schema: { example: { userId: 1 } } })
  async acceptInvite(
    @Body('userId') userId: string,
    @Param('inviteId') inviteId: string,
  ): Promise<void> {
    await this.inviteService.acceptInvite(userId, inviteId); // and send notification back to the user who sent the invite
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of invitations' })
  @ApiParam({ name: 'userId', type: 'number' })
  async getInvites(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      throw new BadRequestException('Invalid userId');
    }
    return this.inviteService.getInvites(parsedUserId);
  }
}
