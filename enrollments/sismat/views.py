from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models.users import Users
from .models.teachers import Teachers
from .models.students import Students
from .models.courses import Courses
from .models.courses_students import CoursesStudents

from .serializers import (
    UserSerializer,
    TeacherSerializer, TeacherDetailSerializer,
    StudentSerializer, StudentDetailSerializer,
    CourseSerializer, CourseDetailSerializer,
    CoursesStudentsSerializer, CoursesStudentsDetailSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teachers.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TeacherDetailSerializer
        return TeacherSerializer

    def get_queryset(self):
        if self.action == 'retrieve':
            return Teachers.objects.select_related('user_id')
        return Teachers.objects.all()


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Students.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StudentDetailSerializer
        return StudentSerializer

    def get_queryset(self):
        if self.action == 'retrieve':
            return Students.objects.select_related('user_id').prefetch_related(
                'coursesstudents_set__course'
            )
        return Students.objects.all()


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Courses.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer

    def get_queryset(self):
        if self.action == 'retrieve':
            return Courses.objects.select_related('teacher_id').prefetch_related(
                'coursesstudents_set__student'
            )
        return Courses.objects.all()


class CoursesStudentsViewSet(viewsets.ModelViewSet):
    queryset = CoursesStudents.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CoursesStudentsDetailSerializer
        return CoursesStudentsSerializer

    def get_queryset(self):
        if self.action == 'retrieve':
            return CoursesStudents.objects.select_related('course', 'student')
        return CoursesStudents.objects.all()


class EnrollmentCertificateView(APIView):
    def get(self, request):
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response(
                {'detail': 'El parámetro student_id es requerido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            student = Students.objects.select_related('user_id').get(id=student_id)
        except (Students.DoesNotExist, Exception):
            return Response(
                {'detail': 'Estudiante no encontrado.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        enrollments = CoursesStudents.objects.select_related(
            'course__teacher_id'
        ).filter(student=student)

        full_name = f"{student.fatherSurname} {student.motherSurname}, {student.names}"
        email = student.user_id.email if student.user_id else ''

        results = []
        for i, enrollment in enumerate(enrollments):
            course = enrollment.course
            teacher = course.teacher_id
            teacher_name = ''
            if teacher:
                teacher_name = f"{teacher.fatherSurname} {teacher.motherSurname}, {teacher.names}"

            words = course.courseName.split()
            acronym = ''.join(w[0] for w in words if w).upper()

            results.append({
                'id': i + 1,
                'student': {
                    'cui': str(student.id),
                    'full_name': full_name,
                    'email': email,
                },
                'workload': {
                    'id': i + 1,
                    'course': {
                        'id': str(course.id),
                        'code': str(course.id)[:8].upper(),
                        'name': course.courseName,
                        'acronym': acronym,
                        'credits': str(course.credits),
                        'year_display': 'III semestre',
                        'semester_display': '',
                    },
                    'group': 'A',
                    'laboratory': 'lab01',
                    'teacher': {
                        'full_name': teacher_name,
                        'email': None,
                    },
                },
                'created': enrollment.created.isoformat(),
            })

        return Response({
            'count': len(results),
            'next': None,
            'previous': None,
            'results': results,
        })