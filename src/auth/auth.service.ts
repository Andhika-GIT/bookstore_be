import { CreateUserDto } from '@/auth/dto/create-user';
import { BadRequestException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { hashPassword, verifyPassword } from '@/common/utils/password.util';
import { SignInUserDto } from './dto/signIn-user';
import { User } from '@/user/entities/user.entity';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async validateUser(user: SignInUserDto): Promise<User> {
    const findUser = await this.userService.findUser(user?.username);

    if (!findUser) {
      throw new BadRequestException('invalid credential');
    }

    const passwordIncorrect = await verifyPassword(
      user?.password,
      findUser?.password,
    );

    if (passwordIncorrect) {
      throw new BadRequestException('invalid credential');
    }

    return findUser;
  }

  async createUser(
    user: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    try {
      let img_url = '';
      const currentUser = await this.userService.findByEmail(user?.email);

      if (currentUser) {
        throw new BadRequestException('Email already used');
      }

      const hashedPassword = await hashPassword(user?.password);

      // upload image if exist
      if (file) {
        const publicId = await this.cloudinaryService.uploadImage(file);

        this.cloudinaryService.generateOptimizedUrl(publicId);
        const transformedURL =
          this.cloudinaryService.generatedTransformtedUrl(publicId);

        img_url = transformedURL;
      }

      const newUser: CreateUserDto = {
        ...user,
        password: hashedPassword,
        img_url: img_url,
      };

      const updatedUser = await this.userService.create(newUser);

      return updatedUser;
    } catch (e) {
      throw new Error(`Failed to create user: ${e.message}`);
    }
  }
}
