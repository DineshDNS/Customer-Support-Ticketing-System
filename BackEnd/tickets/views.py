from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.db.models import Count

from .models import Ticket

from .models import Ticket
from .serializers import TicketListSerializer,TicketCreateSerializer, TicketDetailSerializer, DashboardRecentTicketSerializer


    
class TicketCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "customer":
            return Response(
                {"detail": "Only customers can create tickets"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = TicketCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            ticket = serializer.save()
            return Response(
                {
                    "message": "Ticket created successfully",
                    "ticket_id": ticket.ticket_code
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class TicketListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == "customer":
            tickets = Ticket.objects.filter(created_by=user)
        else:
            tickets = Ticket.objects.all()

        serializer = TicketListSerializer(tickets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class TicketDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            ticket = Ticket.objects.get(pk=pk)
        except Ticket.DoesNotExist:
            return Response({"detail": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND)

        # Customer can view only their own ticket
        if request.user.role == "customer" and ticket.created_by != request.user:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        serializer = TicketDetailSerializer(ticket)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TicketStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            ticket = Ticket.objects.get(pk=pk)
        except Ticket.DoesNotExist:
            return Response(
                {"detail": "Ticket not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.user.role not in ["agent", "admin"]:
            return Response(
                {"detail": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        # 🔒 Allow ONLY status update
        status_value = request.data.get("status")
        if not status_value:
            return Response(
                {"detail": "Status field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        ticket.status = status_value
        ticket.save(update_fields=["status"])

        serializer = TicketDetailSerializer(ticket)
        return Response(serializer.data, status=status.HTTP_200_OK)



class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # 🔐 Role-based ticket access
        if user.role == "customer":
            tickets = Ticket.objects.filter(created_by=user)
        else:
            tickets = Ticket.objects.all()

        # 📊 Summary counts
        summary = {
            "total": tickets.count(),
            "open": tickets.filter(status="open").count(),
            "in_progress": tickets.filter(status="in_progress").count(),
            "resolved": tickets.filter(status="resolved").count(),
            "closed": tickets.filter(status="closed").count(),
            "high_priority": tickets.filter(priority="high").count(),
        }

        # 📋 Recent tickets (latest 5)
        recent_tickets = tickets.order_by("-created_at")[:5]
        recent_serializer = DashboardRecentTicketSerializer(
            recent_tickets, many=True
        )

        return Response({
            "summary": summary,
            "recent_tickets": recent_serializer.data
        })


