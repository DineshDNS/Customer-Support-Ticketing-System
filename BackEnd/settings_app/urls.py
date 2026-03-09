from django.urls import path
from .views import UserProfileAPIView, ChangePasswordAPIView

urlpatterns = [
    path("profile/", UserProfileAPIView.as_view()),
    path("change-password/", ChangePasswordAPIView.as_view()),
]
