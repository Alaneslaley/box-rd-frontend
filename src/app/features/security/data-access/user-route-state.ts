import { Router } from '@angular/router';

/** El estado de navegación evita inventar GET /users/{id} para las rutas de detalle. */
export function currentUserNavigationState(router: Router): unknown {
  return router.getCurrentNavigation()?.extras.state ?? (typeof history !== 'undefined' ? history.state : null);
}
