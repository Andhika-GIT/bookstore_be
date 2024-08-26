import { Factory } from '@mikro-orm/seeder';
import { User } from '@/user/entities/user.entity';

export class UserFactory extends Factory<User> {
  model = User;

  definition(): Partial<User> {
    return {
      username: 'hubla',
      password: 'hubla', // Use a placeholder or default password here
      email: 'hubla@email.com',
      address: 'depok',
      phone_number: '08581938123',
    };
  }
}
