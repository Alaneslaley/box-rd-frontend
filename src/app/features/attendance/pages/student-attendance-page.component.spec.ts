import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AttendanceFacade } from '../data-access/attendance.facade';
import { StudentAttendancePageComponent } from './student-attendance-page.component';

describe('StudentAttendancePageComponent', () => {
  it('carga el historial usando el id de la ruta', async () => { const facade = { loadByStudent: vi.fn().mockReturnValue(of({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, first: true, last: true })) }; await TestBed.configureTestingModule({ imports: [StudentAttendancePageComponent], providers: [provideRouter([]), { provide: AttendanceFacade, useValue: facade }, { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ studentId: 'student-123' }) } } }] }).compileComponents(); const fixture = TestBed.createComponent(StudentAttendancePageComponent); fixture.detectChanges(); expect(facade.loadByStudent).toHaveBeenCalledWith({ studentId: 'student-123', page: 0, size: 20 }); });
});
