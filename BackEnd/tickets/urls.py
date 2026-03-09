from django.urls import path
from .views import TicketCreateView, TicketListView, TicketDetailView, TicketStatusUpdateView, DashboardStatsView


urlpatterns = [
    path('', TicketListView.as_view()),            # GET list
    path('create/', TicketCreateView.as_view()),   # POST create
    path('<int:pk>/', TicketDetailView.as_view()), # GET detail
    path('<int:pk>/update/', TicketStatusUpdateView.as_view()), # PATCH status
    path("dashboard/stats/", DashboardStatsView.as_view()),
]

