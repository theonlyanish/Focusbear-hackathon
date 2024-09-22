import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { FriendService } from './friend.service';

@ApiTags('friends')
@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of friends' })
  @ApiParam({ name: 'userId', type: 'number' })
  async getFriends(@Param('userId') userId: string) {
    return this.friendService.getFriends(parseInt(userId, 10));
  }
}
