import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { validate as isValidUUID } from 'uuid';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUserById(id: string): Promise<User> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid userId format');
    }

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(user: User): Promise<User> {
    if (!user.login || !user.password) {
      throw new BadRequestException('Login and password are required');
    }

    const newUser = this.usersRepository.create(user);
    newUser.password = await bcrypt.hash(user.password, 10);
    return await this.usersRepository.save(newUser);
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid userId format');
    }

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersRepository.update(id, {
      password: hashedPassword,
      version: user.version + 1,
    });
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid userId format');
    }

    const user = await this.usersRepository.delete(id);

    if (user.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return true;
  }
}
