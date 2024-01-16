export function encodeCredentials(username: string, password: string) {
  const credentials = `${username}:${password}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');
  return `Basic ${encodedCredentials}`;
}

export const username = 'admin';

export const password = 'qwerty';
export const authHeader = encodeCredentials(username, password);
