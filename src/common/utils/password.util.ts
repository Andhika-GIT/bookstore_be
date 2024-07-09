import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export const hashPassword = async (password: string): Promise<string> => {
  if (!password) return '';
  const salt = randomBytes(8).toString('hex');
  const hash = (await scrypt(password, salt, 32)) as Buffer;
  return `${salt}.${hash.toString('hex')}`;
};

export const verifyPassword = async (
  enteredPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  const [salt, storedHash] = hashedPassword.split('.');

  const hash = (await scrypt(enteredPassword, salt, 32)) as Buffer;

  if (storedHash !== hash.toString('hex')) {
    return true;
  }

  return false;
};
