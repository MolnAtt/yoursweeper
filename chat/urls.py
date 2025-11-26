from django.urls import path

from . import views
from .views import *

urlpatterns = [
    # path("", views.index, name="index"),
    # path("<str:room_name>/", views.room, name="room"),
    path('', fooldal),
    path('ujjatek/', ujjatek),
    path('ujjatek/letrehoz/', ujjatek_letrehozasa),
    # path('jatek/', jatekok),  felsoroljuk a rendelkezésre álló játékokat, ahol csatlakozni lehet azokhoz
    path('jatek/join/', jatek_join),    
]