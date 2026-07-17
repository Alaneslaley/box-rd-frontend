import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({ selector: 'app-forbidden-page', imports: [RouterLink], template: `<section class="page-state"><h1>Acceso no permitido</h1><p>No tienes permisos para ver esta sección.</p><a class="btn btn-primary" routerLink="/dashboard">Volver al dashboard</a></section>` })
export class ForbiddenPageComponent {}
