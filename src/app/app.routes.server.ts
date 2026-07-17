import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
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
