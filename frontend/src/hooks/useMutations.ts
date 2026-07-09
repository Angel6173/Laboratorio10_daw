import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCourse,
  createEnrollment,
  createStudent,
  createTeacher,
  createUser,
} from '../api/sismatApi'

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  })
}

export function useCreateTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTeacher,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  })
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEnrollment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['enrollments'] }),
  })
}
