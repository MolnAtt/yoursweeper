# mysite/urls.py
from django.contrib import admin
from django.urls import include, path
from app_reg.views import regisztracio, pelda1, pelda2

urlpatterns = [
    # path("chat/", include("chat.urls")),
    path("yoursweeper/", include("chat.urls")),
    path("admin/", admin.site.urls),
    path('regisztracio/', include('app_reg.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
]



