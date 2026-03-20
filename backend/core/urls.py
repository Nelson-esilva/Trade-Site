from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def root_status(request):
    return JsonResponse({'status': 'ok', 'service': 'trade-site-api'})


def healthz(request):
    return JsonResponse({'ok': True})

urlpatterns = [
    path('', root_status, name='root_status'),
    path('healthz/', healthz, name='healthz'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth_app.urls')),
    path('api/users/', include('users.urls')),
    path('api/items/', include('items.urls')),
    path('api/offers/', include('offers.urls')),
]

# Servir arquivos de mídia em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)