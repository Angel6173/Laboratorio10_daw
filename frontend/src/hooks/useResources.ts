import { useQuery } from '@tanstack/react-query'
import {
  getCourses,
  getEnrollments,
  getStudents,
  getTeachers,
  getUsers,
} from '../api/sismatApi'

export const useUsers = (search = '') =>
  useQuery({ queryKey: ['users', search], queryFn: () => getUsers(search) })

export const useTeachers = (search = '') =>
  useQuery({ queryKey: ['teachers', search], queryFn: () => getTeachers(search) })

export const useStudents = (search = '') =>
  useQuery({ queryKey: ['students', search], queryFn: () => getStudents(search) })

export const useCourses = (search = '') =>
  useQuery({ queryKey: ['courses', search], queryFn: () => getCourses(search) })

export const useEnrollments = (search = '') =>
  useQuery({
    queryKey: ['enrollments', search],
    queryFn: () => getEnrollments(search),
  })
