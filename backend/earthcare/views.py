from django.views.generic import View
from django.http import HttpResponse
from django.conf import settings
import os


class ReactAppView(View):
    """
    Serves the React application for all non-API routes.
    This allows React Router to handle client-side routing.
    """
    
    def get(self, request, *args, **kwargs):
        try:
            # Path to the built React index.html
            index_path = os.path.join(settings.BASE_DIR, 'frontend_build', 'index.html')
            
            with open(index_path, 'r', encoding='utf-8') as f:
                return HttpResponse(f.read(), content_type='text/html')
        except FileNotFoundError:
            return HttpResponse(
                """
                <html>
                <body>
                <h1>Frontend not built</h1>
                <p>The React frontend has not been built yet. Please build it first.</p>
                </body>
                </html>
                """,
                status=404
            )
