import { TestBed } from '@angular/core/testing';
import { IdempotencyKeyService } from './idempotency-key.service';

describe('IdempotencyKeyService', () => {
  let service: IdempotencyKeyService;
  beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject(IdempotencyKeyService); });
  it('genera una clave no vacía y menor al máximo backend', () => { const key = service.generate(); expect(key.length).toBeGreaterThan(0); expect(key.length).toBeLessThanOrEqual(120); });
  it('genera claves diferentes para intentos distintos', () => { expect(service.generate()).not.toBe(service.generate()); });
});
