import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository';
import { signToken } from '../utils/jwtHelper';
import { AppError } from '../utils/AppError';
import { RegisterInput, LoginInput } from '../validators/auth';

interface AuthResult {
  token: string;
  user: { id: number; name: string; email: string };
}

export const authService = {
  register: async (input: RegisterInput): Promise<AuthResult> => {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new AppError('Email already in use', 409);

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const user = await userRepository.create({ ...input, password: hashedPassword });

    const token = signToken({ userId: user.id, email: user.email });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  },

  login: async (input: LoginInput): Promise<AuthResult> => {
    const user = await userRepository.findByEmail(input.email);
    if (!user) throw new AppError('Invalid email or password', 401);

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new AppError('Invalid email or password', 401);

    const token = signToken({ userId: user.id, email: user.email });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  },
};
