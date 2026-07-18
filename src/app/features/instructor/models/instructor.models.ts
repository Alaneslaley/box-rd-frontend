import { AttendanceResponse } from '../../attendance/models/attendance.models';

export interface InstructorTodayResponse {
  attendance: AttendanceResponse;
  photoFileId: string | null;
  studentName: string;
}

export interface InstructorTodayParams { page: number; size: number; }
