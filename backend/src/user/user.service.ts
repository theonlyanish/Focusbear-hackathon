import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'dto/user/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });
  }
}
