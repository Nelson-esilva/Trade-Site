# auth_app/views.py

from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer

User = get_user_model()
MAX_LOGIN_ATTEMPTS = 5
LOGIN_BLOCK_SECONDS = 15 * 60

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Não criar token - usuário deve fazer login manualmente
        return Response({
            'message': 'Usuário criado com sucesso. Faça login para continuar.',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'name': user.name,
            }
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)

    def _get_client_identifier(self, request, username):
        forwarded = request.META.get('HTTP_X_FORWARDED_FOR', '')
        ip = forwarded.split(',')[0].strip() if forwarded else request.META.get('REMOTE_ADDR', 'unknown')
        return f'auth:login:{username}:{ip}'

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username e password são obrigatórios'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        cache_key = self._get_client_identifier(request, username)
        attempts = cache.get(cache_key, 0)
        if attempts >= MAX_LOGIN_ATTEMPTS:
            return Response(
                {'error': 'Muitas tentativas de login. Tente novamente em 15 minutos.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        user = authenticate(username=username, password=password)
        
        if user:
            cache.delete(cache_key)
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'name': user.name,
                    'is_trade_admin': getattr(user, 'is_trade_admin', False),
                    'is_superuser': user.is_superuser,
                },
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                # Compatibilidade com frontend legado que usa "token".
                'token': str(refresh.access_token),
            })
        else:
            cache.set(cache_key, attempts + 1, LOGIN_BLOCK_SECONDS)
            return Response(
                {'error': 'Credenciais inválidas'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(generics.GenericAPIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response({'error': 'Refresh token inválido'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Logout realizado com sucesso.'}, status=status.HTTP_200_OK)