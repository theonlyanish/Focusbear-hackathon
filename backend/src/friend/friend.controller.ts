import { Controller, Get, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { FriendService } from './friend.service';

@ApiTags('friends')
@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of friends' })
  @ApiBody({ schema: { example: { userId: 1 } } })
  async getFriends(@Body('userId') userId: number) {
    return this.friendService.getFriends(userId);
  }
}
