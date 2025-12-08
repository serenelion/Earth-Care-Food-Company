"""
Django management command to create an admin superuser if one doesn't exist.
This runs automatically during deployment to ensure admin access.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decouple import config


class Command(BaseCommand):
    help = 'Creates an admin superuser if one does not exist'

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Get admin credentials from environment variables with defaults
        admin_username = config('ADMIN_USERNAME', default='admin')
        admin_email = config('ADMIN_EMAIL', default='admin@earthcare.food')
        admin_password = config('ADMIN_PASSWORD', default='earthcare2024')
        
        # Check if admin user already exists
        if User.objects.filter(username=admin_username).exists():
            self.stdout.write(
                self.style.WARNING(f'Admin user "{admin_username}" already exists')
            )
            return
        
        # Create the superuser
        User.objects.create_superuser(
            username=admin_username,
            email=admin_email,
            password=admin_password
        )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created admin user "{admin_username}"')
        )
