import { apiFetch } from './client'
import type {
  Course,
  CourseStudent,
  EnrollmentCertificateResponse,
  Student,
  Teacher,
  User,
} from '../types/models'

function withSearch(path: string, search?: string) {
  return search ? `${path}?search=${encodeURIComponent(search)}` : path
}

export const getUsers = (search?: string) =>
  apiFetch<User[]>(withSearch('/api/users/', search))
export const getTeachers = (search?: string) =>
  apiFetch<Teacher[]>(withSearch('/api/teachers/', search))
export const getStudents = (search?: string) =>
  apiFetch<Student[]>(withSearch('/api/students/', search))
export const getCourses = (search?: string) =>
  apiFetch<Course[]>(withSearch('/api/courses/', search))
export const getEnrollments = (search?: string) =>
  apiFetch<CourseStudent[]>(withSearch('/api/courses-students/', search))

type Payload = Record<string, string>

const post = <T>(path: string, data: Payload) =>
  apiFetch<T>(path, { method: 'POST', body: JSON.stringify(data) })

export const createUser = (data: Payload) => post<User>('/api/users/', data)
export const createTeacher = (data: Payload) => post<Teacher>('/api/teachers/', data)
export const createStudent = (data: Payload) => post<Student>('/api/students/', data)
export const createCourse = (data: Payload) => post<Course>('/api/courses/', data)
export const createEnrollment = (data: Payload) => post<CourseStudent>('/api/courses-students/', data)

const patch = <T>(path: string, id: string, data: Payload) =>
  apiFetch<T>(`${path}${id}/`, { method: 'PATCH', body: JSON.stringify(data) })

const remove = (path: string, id: string) =>
  apiFetch<void>(`${path}${id}/`, { method: 'DELETE' })

export const updateUser = (id: string, data: Payload) => patch<User>('/api/users/', id, data)
export const updateTeacher = (id: string, data: Payload) => patch<Teacher>('/api/teachers/', id, data)
export const updateStudent = (id: string, data: Payload) => patch<Student>('/api/students/', id, data)
export const updateCourse = (id: string, data: Payload) => patch<Course>('/api/courses/', id, data)
export const updateEnrollment = (id: string, data: Payload) => patch<CourseStudent>('/api/courses-students/', id, data)

export const deleteUser = (id: string) => remove('/api/users/', id)
export const deleteTeacher = (id: string) => remove('/api/teachers/', id)
export const deleteStudent = (id: string) => remove('/api/students/', id)
export const deleteCourse = (id: string) => remove('/api/courses/', id)
export const deleteEnrollment = (id: string) => remove('/api/courses-students/', id)

export function getEnrollmentCertificate(studentId: string) {
  const query = encodeURIComponent(studentId)
  return apiFetch<EnrollmentCertificateResponse>(
    `/api/enrollment-certificate/?student_id=${query}`,
  )
}
