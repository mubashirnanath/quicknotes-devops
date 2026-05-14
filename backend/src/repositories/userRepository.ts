import { User, UserAttributes } from '../models/User';
import { RegisterInput } from '../validators/auth';

type SafeUser = Omit<UserAttributes, 'password'>;

export const userRepository = {
  findByEmail: (email: string): Promise<User | null> =>
    User.findOne({ where: { email } }),

  findById: async (id: number): Promise<SafeUser | null> => {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    return user ? (user.get({ plain: true }) as SafeUser) : null;
  },

  create: (data: RegisterInput & { password: string }): Promise<User> =>
    User.create(data),
};
