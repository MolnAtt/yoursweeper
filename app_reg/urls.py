from django.urls import path
from .views import regisztracio, pelda1, pelda2

urlpatterns = [
    path('', regisztracio, name="regisztracio"),
    path('pelda1/', pelda1, name="pelda1"),
    path('pelda2/', pelda2, name="pelda2"),
]
