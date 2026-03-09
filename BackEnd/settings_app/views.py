from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django.contrib.auth import get_user_model

from .serializers import (
    UserProfileSerializer,
    ChangePasswordSerializer
)

User = get_user_model()


class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        if not user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"message": "Old password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response({"message": "Password updated successfully"})
