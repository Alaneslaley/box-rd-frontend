import { routes } from './app.routes';

describe('app routes', () => {
  it('mantiene /login como entrada pública compatible', () => {
    expect(routes.find((route) => route.path === 'login')).toMatchObject({
      pathMatch: 'full',
      redirectTo: 'auth/login',
    });
  });
});
