import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { StudentsApiService } from './students-api.service';
import { StudentsFacade } from './students.facade';

describe('StudentsFacade', () => {
  const api = { search: vi.fn(), create: vi.fn(), update: vi.fn(), getById: vi.fn() };
  let facade: StudentsFacade;
  beforeEach(() => { vi.clearAllMocks(); TestBed.configureTestingModule({ providers: [StudentsFacade, { provide: StudentsApiService, useValue: api }] }); facade = TestBed.inject(StudentsFacade); });

  it('carga el listado paginado', () => {
    api.search.mockReturnValue(of({ content: [{ id: '1', photoFileId: null, fullName: 'Ana Pérez', phone: null, age: 20, ageCategory: 'ADULTO_JOVEN', level: 'BEGINNER', status: 'ACTIVO' }], page: 0, size: 20, totalElements: 1, totalPages: 1, first: true, last: true }));
    facade.loadStudents();
    expect(facade.students()).toHaveLength(1); expect(facade.loading()).toBe(false); expect(facade.error()).toBeNull();
  });

  it('conserva un error controlado cuando falla el listado', () => {
    const error: ApiError = { status: 500, code: 'INTERNAL_ERROR', message: 'Error controlado' };
    api.search.mockReturnValue(throwError(() => error));
    facade.loadStudents();
    expect(facade.error()).toEqual(error); expect(facade.loading()).toBe(false);
  });
});
