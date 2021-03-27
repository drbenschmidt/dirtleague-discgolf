import RepositoryServices from './data-access/repository-services';
import hashPassword from './crypto/hash';

const services = new RepositoryServices();

const insertUser = async (
  email: string,
  password: string,
  isAdmin = false
): Promise<void> => {
  const { hash, salt } = await hashPassword(password);

  await services.users.insert({
    email,
    passwordHash: hash,
    passwordSalt: salt,
    isAdmin,
  });
};

// First two aren't what we want.
const [, , email, password] = process.argv;

if (!email || !password) {
  console.error('Email or password not provided');

  process.exit(1);
}

const work = async () => {
  await insertUser(email, password, true);
};

work()
  .then(() => process.exit(0))
  .catch(console.error);
