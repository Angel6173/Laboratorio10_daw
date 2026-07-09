import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/sismatApi'

type Payload = Record<string, string>

function useCreate<T>(fn: (data: Payload) => Promise<T>, key: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  })
}

function useUpdate<T>(fn: (id: string, data: Payload) => Promise<T>, key: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Payload }) => fn(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  })
}

function useDelete(fn: (id: string) => Promise<unknown>, key: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  })
}

export const useCreateUser = () => useCreate(api.createUser, 'users')
export const useUpdateUser = () => useUpdate(api.updateUser, 'users')
export const useDeleteUser = () => useDelete(api.deleteUser, 'users')

export const useCreateTeacher = () => useCreate(api.createTeacher, 'teachers')
export const useUpdateTeacher = () => useUpdate(api.updateTeacher, 'teachers')
export const useDeleteTeacher = () => useDelete(api.deleteTeacher, 'teachers')

export const useCreateStudent = () => useCreate(api.createStudent, 'students')
export const useUpdateStudent = () => useUpdate(api.updateStudent, 'students')
export const useDeleteStudent = () => useDelete(api.deleteStudent, 'students')

export const useCreateCourse = () => useCreate(api.createCourse, 'courses')
export const useUpdateCourse = () => useUpdate(api.updateCourse, 'courses')
export const useDeleteCourse = () => useDelete(api.deleteCourse, 'courses')

export const useCreateEnrollment = () => useCreate(api.createEnrollment, 'enrollments')
export const useUpdateEnrollment = () => useUpdate(api.updateEnrollment, 'enrollments')
export const useDeleteEnrollment = () => useDelete(api.deleteEnrollment, 'enrollments')
