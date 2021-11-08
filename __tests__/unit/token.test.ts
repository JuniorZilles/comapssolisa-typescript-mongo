import { generateToken, verifyToken } from '@services/TokenService';
import { JwtPayload } from 'jsonwebtoken';

describe('src :: api :: services :: token', () => {
  test('should generate a token an verification should pass', async () => {
    const result = await generateToken({
      email: 'jao@mail.com',
      habilitado: 'sim',
      id: 'sajhdjaks45454asd4sa5d465as4'
    });

    expect(result).toBeDefined();
    const content = verifyToken(result) as JwtPayload;

    const tempContent = content.content;

    expect(tempContent.id).toBe('sajhdjaks45454asd4sa5d465as4');
    expect(tempContent.email).toBe('jao@mail.com');
    expect(tempContent.habilitado).toBe('sim');
  });

  test('should not pass verification of invalid token', async () => {
    const result =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    try {
      verifyToken(result);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
