from rest_framework.routers import DefaultRouter
from django.urls import path
from drf_spectacular.views import SpectacularAPIView

try:
    from drf_spectacular.views import SpectacularSwaggerUIView, SpectacularRedocView
except ImportError:
    from drf_spectacular.views import SpectacularSwaggerView as SpectacularSwaggerUIView
    from drf_spectacular.views import SpectacularRedocView

from .views import (
    UserViewSet,
    TeacherViewSet,
    StudentViewSet,
    CourseViewSet,
    CoursesStudentsViewSet,
    EnrollmentCertificateView,
)

router = DefaultRouter()
router.register(r'users',            UserViewSet,            basename='user')
router.register(r'teachers',         TeacherViewSet,         basename='teacher')
router.register(r'students',         StudentViewSet,         basename='student')
router.register(r'courses',          CourseViewSet,          basename='course')
router.register(r'courses-students', CoursesStudentsViewSet, basename='courses-students')

urlpatterns = router.urls + [
    path('enrollment-certificate/', EnrollmentCertificateView.as_view(), name='enrollment-certificate'),
    path('schema/', SpectacularAPIView.as_view(),                        name='schema'),
    path('docs/',   SpectacularSwaggerUIView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/',  SpectacularRedocView.as_view(url_name='schema'),     name='redoc'),
]