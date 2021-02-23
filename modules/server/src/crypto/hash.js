import hashBuilder from 'pbkdf2-password';

const hasher = hashBuilder({
  digest: 'sha256'
});

export const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    hasher({ password, salt }, (err, _pass, _salt, _hash) => {
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
