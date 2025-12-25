import os

from django.core.wsgi import get_wsgi_application

# Aponta para o arquivo settings.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_netfake.settings')

application = get_wsgi_application()