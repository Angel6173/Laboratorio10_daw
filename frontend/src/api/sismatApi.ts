import { apiFetch } from './client'
import type {
  Course,
  CourseStudent,
  EnrollmentCertificateResponse,
  Student,
  Teacher,
  User,
} from '../types/models'

export const getUsers = () => apiFetch<User[]>('/api/users/')
export const getTeachers = () => apiFetch<Teacher[]>('/api/teachers/')
export const getStudents = () => apiFetch<Student[]>('/api/students/')
export const getCourses = () => apiFetch<Course[]>('/api/courses/')
export const getEnrollments = () => apiFetch<CourseStudent[]>('/api/courses-students/')

type Payload = Record<string, string>

const post = <T>(path: string, data: Payload) =>
  apiFetch<T>(path, { method: 'POST', body: JSON.stringify(data) })

export const createTeacher = (data: Payload) => post<Teacher>('/api/teachers/', data)
export const createStudent = (data: Payload) => post<Student>('/api/students/', data)
export const createCourse = (data: Payload) => post<Course>('/api/courses/', data)
export const createEnrollment = (data: Payload) => post<CourseStudent>('/api/courses-students/', data)

export function getEnrollmentCertificate(studentId: string) {
  const query = encodeURIComponent(studentId)
  return apiFetch<EnrollmentCertificateResponse>(
    `/api/enrollment-certificate/?student_id=${query}`,
  )
}
