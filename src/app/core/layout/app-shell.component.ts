import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { TopbarComponent } from './topbar.component';

@Component({ selector: 'app-shell', imports: [RouterOutlet, SidebarComponent, TopbarComponent], template: `<div class="app-shell"><app-sidebar /><div class="shell-content"><app-topbar /><main class="content-area"><router-outlet /></main></div></div>` })
export class AppShellComponent {}
