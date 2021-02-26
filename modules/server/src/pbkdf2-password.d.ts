declare module 'pbkdf2-password' {
  interface BuilderOptions {
    saltLength?: number;
    iterations?: number;
    keyLength?: number;
    digest?: string | 'sha1' | 'sha256';
  }

  interface HasherOptions {
    password: string;
    salt: string;
  }

  function hasher(
    options: HasherOptions,
    callback: (err: object, pass: string, salt: string, hash: string) => void
  ): void;

  function builder(options: BuilderOptions): typeof hasher;

  export = builder;
}
