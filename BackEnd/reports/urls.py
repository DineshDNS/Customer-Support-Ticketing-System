from django.urls import path
from .views import ReportSummaryAPIView

urlpatterns = [
    path("summary/", ReportSummaryAPIView.as_view(), name="report-summary"),
]
