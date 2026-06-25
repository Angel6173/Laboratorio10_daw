from .UserSerializer import UserSerializer
from .TeacherSerializer import TeacherSerializer, TeacherDetailSerializer
from .StudentSerializer import StudentSerializer, StudentDetailSerializer
from .CourseSerializer import CourseSerializer, CourseDetailSerializer
from .CoursesStudentsSerializer import CoursesStudentsSerializer, CoursesStudentsDetailSerializer

__all__ = [
    'UserSerializer',
    'TeacherSerializer',
    'TeacherDetailSerializer',
    'StudentSerializer',
    'StudentDetailSerializer',
    'CourseSerializer',
    'CourseDetailSerializer',
    'CoursesStudentsSerializer',
    'CoursesStudentsDetailSerializer',
]