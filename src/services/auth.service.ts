import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { AppError, AuthenticationError } from '../types/errors';
import { Role } from '@prisma/client';

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

function isStrongPassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/.test(password);
}

export const registerUser = async (email: string, password: string) => {
  if (!isStrongPassword(password)) {
    throw new AppError('Provided password is weak. Please provide a stronger password.', 400);
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('User already exists', 400);
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, role: 'USER' as Role },
  });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  return { user, token, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AuthenticationError('Invalid credentials');
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  return { user, token, refreshToken };
};

export const refreshAccessToken = (refreshToken: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET!,
      (err, payload: any) => {
        if (err) {
          return reject(new AppError('Invalid refresh token', 403));
        }
        const newAccessToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET!, {
          expiresIn: '1h',
        });
        resolve({ token: newAccessToken });
      }
    );
  });
};
