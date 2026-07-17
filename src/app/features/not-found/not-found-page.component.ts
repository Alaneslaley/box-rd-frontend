import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({ selector: 'app-not-found-page', imports: [RouterLink], template: `<section class="page-state"><h1>Página no encontrada</h1><p>La ruta solicitada no existe.</p><a class="btn btn-primary" routerLink="/dashboard">Ir al dashboard</a></section>` })
export class NotFoundPageComponent {}
