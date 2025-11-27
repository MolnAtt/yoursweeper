from django.urls import path

from . import views
from .views import *

urlpatterns = [
    # path("", views.index, name="index"),
    # path("<str:room_name>/", views.room, name="room"),
    path('', index, name='index'),
    path('play/<int:az_id>/', play),
    # path('logout/', kijelentkezes),
    path('ujjatek/', ujjatek),
    path('ujjatek/letrehoz/', ujjatek_letrehozasa),
    path('lobby/', jatekok, name='lobby'),
    path('lobby/join/', jatek_join),
]