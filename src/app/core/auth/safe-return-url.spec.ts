import { safeReturnUrl } from './safe-return-url';

describe('safeReturnUrl', () => {
  it('conserva rutas internas', () => expect(safeReturnUrl('/students/123?tab=detail')).toBe('/students/123?tab=detail'));
  it.each(['https://evil.example', '//evil.example', '\\\\evil.example', 'dashboard', '/dashboard\nhttps://evil.example'])(
    'rechaza una redirección no segura: %s',
    (value) => expect(safeReturnUrl(value)).toBe('/dashboard'),
  );
});
