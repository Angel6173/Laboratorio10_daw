export interface Teacher {
  full_name: string
  email: string | null
}

export interface Course {
  id: string
  code: string
  name: string
  acronym: string
  credits: string
  year_display: string
  semester_display: string
}

export interface Workload {
  id: number
  course: Course
  group: string
  laboratory: string
  teacher: Teacher
}

export interface Student {
  cui: number
  full_name: string
  email: string
}

export interface EnrollmentResult {
  id: number
  student: Student
  workload: Workload
  created: string
}

export interface EnrollmentCertificateResponse {
  count: number
  next: string | null
  previous: string | null
  results: EnrollmentResult[]
}
