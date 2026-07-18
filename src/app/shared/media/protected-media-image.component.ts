import { Component, PLATFORM_ID, effect, inject, input, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MediaApiService } from './media-api.service';

@Component({
  selector: 'app-protected-media-image',
  template: `
    <div class="student-photo" [class.photo-unavailable]="!objectUrl()">
      @if (objectUrl(); as source) { <img [src]="source" [alt]="alt()" /> }
      @else { <span aria-hidden="true">{{ initials() }}</span><span class="sr-only">Foto no disponible</span> }
    </div>
  `,
})
export class ProtectedMediaImageComponent {
  private readonly media = inject(MediaApiService);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly fileId = input<string | null | undefined>(null);
  readonly alt = input('Foto del alumno');
  readonly name = input('Alumno');
  readonly objectUrl = signal<string | null>(null);

  constructor() {
    effect((onCleanup) => {
      const fileId = this.fileId();
      this.objectUrl.set(null);
      if (!fileId || !this.browser) return;
      let currentUrl: string | null = null;
      const subscription = this.media.getBlob(fileId).subscribe({
        next: (blob) => { currentUrl = URL.createObjectURL(blob); this.objectUrl.set(currentUrl); },
        error: () => this.objectUrl.set(null),
      });
      onCleanup(() => { subscription.unsubscribe(); if (currentUrl) URL.revokeObjectURL(currentUrl); });
    });
  }

  initials(): string {
    return this.name().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'GB';
  }
}
