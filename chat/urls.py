from django.urls import path

from . import views
from .views import *
from .apis import *

urlpatterns = [
    path('', index, name='index'),
    path('play/<int:az_id>/', play),
    # path('logout/', kijelentkezes),
    path('ujjatek/', ujjatek),
    path('ujjatek/letrehoz/', ujjatek_letrehozasa),
    path('lobby/', jatekok, name='lobby'),
    path('lobby/join/', jatek_join),
    path("<str:room_name>/", views.room, name="room"),
]

# API parancsok
urlpatterns += [
    path('api/get/melyik/jatekid/<int:jatek_id>/', api_get_melyik),
    path('api/get/aknaszam/jatekid/<int:jatek_id>/', api_get_aknaszam),
]