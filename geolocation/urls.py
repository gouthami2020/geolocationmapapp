from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

from django.contrib import admin
from django.urls import path
from app import views_geolocations
from app import views
from geolocation import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/geolocations/', views_geolocations.geolocations),
    path('api/geolocations/<int:geolocation_id>/', views_geolocations.geolocation),
    path('', views.index),
    path('login', views.login_view),
    path('map', views.map_view)
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
