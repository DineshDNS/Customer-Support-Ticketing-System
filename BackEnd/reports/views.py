from datetime import timedelta
from django.utils.timezone import now
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from tickets.models import Ticket
from .serializers import ReportSummarySerializer, DailyReportSerializer

User = get_user_model()


class ReportSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        summary_data = {
            "total_users": User.objects.count(),
            "total_tickets": Ticket.objects.count(),
            "open_tickets": Ticket.objects.filter(status="open").count(),
            "resolved_tickets": Ticket.objects.filter(status="resolved").count(),
        }

        summary_serializer = ReportSummarySerializer(summary_data)

        start_date = now() - timedelta(days=7)
        tickets = Ticket.objects.filter(created_at__gte=start_date)

        daily_data = {}

        for ticket in tickets:
            date = ticket.created_at.date()
            if date not in daily_data:
                daily_data[date] = {
                    "date": date,
                    "new": 0,
                    "resolved": 0,
                    "pending": 0,
                }

            daily_data[date]["new"] += 1

            if ticket.status == "resolved":
                daily_data[date]["resolved"] += 1
            else:
                daily_data[date]["pending"] += 1

        daily_reports = DailyReportSerializer(
            daily_data.values(),
            many=True
        )

        return Response({
            "summary": summary_serializer.data,
            "daily_reports": daily_reports.data
        })
