import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { MediaApiService } from './media-api.service';
import { ProtectedMediaImageComponent } from './protected-media-image.component';

describe('ProtectedMediaImageComponent', () => {
  const media = { getBlob: vi.fn() };
  let fixture: ComponentFixture<ProtectedMediaImageComponent>;

  beforeEach(async () => {
    media.getBlob.mockReset();
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:student-photo') });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });
    await TestBed.configureTestingModule({
      imports: [ProtectedMediaImageComponent],
      providers: [{ provide: MediaApiService, useValue: media }],
    }).compileComponents();
  });

  it('revoca el object URL al reemplazar o destruir la imagen', () => {
    const first = new Subject<Blob>();
    const second = new Subject<Blob>();
    media.getBlob.mockReturnValueOnce(first).mockReturnValueOnce(second);
    fixture = TestBed.createComponent(ProtectedMediaImageComponent);
    fixture.componentRef.setInput('fileId', 'photo-1');
    fixture.detectChanges();
    first.next(new Blob(['image']));
    fixture.detectChanges();
    expect(fixture.componentInstance.objectUrl()).toBe('blob:student-photo');

    fixture.componentRef.setInput('fileId', 'photo-2');
    fixture.detectChanges();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:student-photo');

    second.next(new Blob(['new-image']));
    fixture.destroy();
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
  });
});
