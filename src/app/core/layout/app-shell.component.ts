import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { TopbarComponent } from './topbar.component';

@Component({ selector: 'app-shell', imports: [RouterOutlet, SidebarComponent, TopbarComponent], template: `<a class="skip-link" href="#main-content">Saltar al contenido principal</a><div class="app-shell"><app-sidebar /><div class="shell-content"><app-topbar /><main id="main-content" class="content-area" tabindex="-1"><router-outlet /></main></div></div>` })
export class AppShellComponent {}
