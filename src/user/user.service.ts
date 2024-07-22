import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async findUser(usernameOrEmail: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    return user ?? null; // Return null if no user found
  }
  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({ id: id });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneOrFail({ username: username });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email: email });
  }

  async create(user: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(user);

    await this.em.persistAndFlush(newUser);

    return newUser;
  }
}
