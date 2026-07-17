import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({ selector: 'app-forbidden-page', imports: [RouterLink], template: `<section class="page-state"><h1>Acceso no disponible</h1><p>No cuentas con permiso visual para acceder a esta sección.</p><a class="btn btn-primary" routerLink="/dashboard">Volver al dashboard</a></section>` })
export class ForbiddenPageComponent {}
