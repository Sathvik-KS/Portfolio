from django.test import TestCase
from rest_framework.test import APIClient

from .models import Project


class ProjectApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.project = Project.objects.create(
            title="Sample Project",
            description="A project used in tests.",
            github_link="https://github.com/example/sample",
        )

    def test_list_projects(self):
        response = self.client.get("/api/projects/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Sample Project")

    def test_project_detail(self):
        response = self.client.get(f"/api/projects/{self.project.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["github_link"], "https://github.com/example/sample"
        )

    def test_missing_project_returns_404(self):
        response = self.client.get("/api/projects/999999/")
        self.assertEqual(response.status_code, 404)

    def test_anonymous_cannot_create_project(self):
        response = self.client.post(
            "/api/projects/",
            {"title": "Nope", "description": "x", "github_link": "https://example.com"},
        )
        self.assertEqual(response.status_code, 403)
