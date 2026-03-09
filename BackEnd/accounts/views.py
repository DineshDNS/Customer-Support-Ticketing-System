from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

from .serializers import (
    SignupSerializer,
    LoginSerializer,
    ForgotPasswordSerializer,
    VerifyOTPSerializer,
    ResetPasswordSerializer,
)
from .models import PasswordResetOTP, User
from .utils import generate_otp


# SIGNUP

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED,
        )


# LOGIN
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "role": user.role,
            },
            status=status.HTTP_200_OK,
        )


# FORGOT PASSWORD
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "User with this email does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Remove old OTPs
        PasswordResetOTP.objects.filter(user=user).delete()

        otp = generate_otp()

        PasswordResetOTP.objects.create(
            user=user,
            otp=otp,
            expires_at=timezone.now() + timedelta(minutes=10),
        )

        send_mail(
            subject="Password Reset OTP",
            message=f"Your OTP is {otp}. It is valid for 10 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response(
            {"message": "OTP sent to your email"},
            status=status.HTTP_200_OK,
        )


# VERIFY OTP
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        try:
            user = User.objects.get(email=email)
            record = PasswordResetOTP.objects.filter(user=user).latest("created_at")
        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response(
                {"message": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if record.is_expired():
            return Response(
                {"message": "OTP expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if record.otp != otp:
            return Response(
                {"message": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "OTP verified"},
            status=status.HTTP_200_OK,
        )


# RESET PASSWORD

from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.get(email=email)
            record = PasswordResetOTP.objects.filter(user=user).latest("created_at")
        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response(
                {"message": "Invalid request"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if record.is_expired():
            return Response(
                {"message": "OTP expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if record.otp != otp:
            return Response(
                {"message": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # PASSWORD VALIDATION WITH CLEAR ERRORS
        try:
            validate_password(password, user)
        except DjangoValidationError as e:
            return Response(
                {
                    "message": "Password validation failed",
                    "errors": e.messages,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # SAVE PASSWORD
        user.set_password(password)
        user.save()

        PasswordResetOTP.objects.filter(user=user).delete()

        return Response(
            {"message": "Password reset successful"},
            status=status.HTTP_200_OK,
        )

