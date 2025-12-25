from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, TodoViewSet, PostViewSet, PhotoViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'todos', TodoViewSet)
router.register(r'posts', PostViewSet)
router.register(r'photos', PhotoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]