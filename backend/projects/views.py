from .models import Project
from .serializers import ProjectSerializer

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly


# Create your views here.
class ProjectViewSet(viewsets.ModelViewSet):
    """Public read access; only authenticated users can create or modify projects."""

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
