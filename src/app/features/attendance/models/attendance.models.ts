export interface CheckInRequest { studentId: string; }

export interface AttendanceResponse {
  id: string;
  branchId: string;
  studentId: string;
  attendanceDate: string;
  checkedInAt: string;
  status: string;
  ageAtEvent: number;
  ageCategoryAtEvent: string;
  levelAtEvent: string;
  membershipStatusAtEvent: string;
  membershipEndDateAtEvent: string | null;
}

export interface CheckInResponse {
  decision: string;
  photoFileId: string | null;
  studentName: string;
  age: number;
  ageCategory: string;
  level: string;
  membershipStatus: string;
  membershipEndDate: string | null;
  attendance: AttendanceResponse;
}

export interface AttendancePageParams { page: number; size: number; }
export interface StudentAttendanceParams extends AttendancePageParams { studentId: string; }
