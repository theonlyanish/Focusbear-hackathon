import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Get,
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
    await this.inviteService.createInvite(userId, friendId);
  }

  @Post(':inviteId/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept an invitation' })
  @ApiParam({ name: 'inviteId', type: 'number' })
  @ApiBody({ schema: { example: { userId: 1 } } })
  async acceptInvite(
    @Body('userId') userId: number,
    @Param('inviteId') inviteId: number,
  ): Promise<void> {
    await this.inviteService.acceptInvite(userId, inviteId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of invitations' })
  @ApiBody({ schema: { example: { userId: 1 } } })
  async getInvites(@Body('userId') userId: number) {
    return this.inviteService.getInvites(userId);
  }
}
