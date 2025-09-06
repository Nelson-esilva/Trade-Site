# auth_app/urls.py

from django.urls import path
from .views import RegisterView
from rest_framework.authtoken.views import obtain_auth_token # Importe a view do DRF

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', obtain_auth_token, name='login'), # Esta view recebe username e password e retorna o token
]