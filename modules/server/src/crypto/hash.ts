import hashBuilder from 'pbkdf2-password';

const hasher = hashBuilder({
  digest: 'sha256'
});

export const hashPassword = (password: string, salt: string): Promise<{hash: string, salt: string}> => {
  return new Promise((resolve, reject) => {
    hasher({ password, salt }, (err: object, _pass: string, _salt: string, _hash: string) => {
      if (err) {
        reject(err);
      }

      resolve({
        hash: _hash,
        salt: _salt,
      });
    });
  });
};
