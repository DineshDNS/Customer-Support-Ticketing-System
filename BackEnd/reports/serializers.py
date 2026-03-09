from rest_framework import serializers


class ReportSummarySerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_tickets = serializers.IntegerField()
    open_tickets = serializers.IntegerField()
    resolved_tickets = serializers.IntegerField()


class DailyReportSerializer(serializers.Serializer):
    date = serializers.DateField()
    new = serializers.IntegerField()
    resolved = serializers.IntegerField()
    pending = serializers.IntegerField()
