import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'security/users/:id/roles',
    renderMode: RenderMode.Client
  },
  {
    path: 'security/users/:id/status',
    renderMode: RenderMode.Client
  },
  {
    path: 'security/users/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'attendance/student/:studentId',
    renderMode: RenderMode.Client
  },
  {
    path: 'payments/:id/receipt',
    renderMode: RenderMode.Client
  },
  {
    path: 'payments/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'plans/:id/edit',
    renderMode: RenderMode.Client
  },
  {
    path: 'memberships/:id/renew',
    renderMode: RenderMode.Client
  },
  {
    path: 'students/:id/edit',
    renderMode: RenderMode.Client
  },
  {
    path: 'students/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
