# mysite/urls.py
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import include, path
from app_reg.views import regisztracio, pelda1, pelda2

urlpatterns = [
    # path("chat/", include("chat.urls")),
    # path('yoursweeper/logout/', lambda request : redirect('/yoursweeper/')),
    path("yoursweeper/", include("chat.urls")),
    path("admin/", admin.site.urls),
    path('regisztracio/', include('app_reg.urls')),
    path('accounts/profile/', lambda request : redirect('/yoursweeper/')),
    path('accounts/', include('django.contrib.auth.urls')),
]



