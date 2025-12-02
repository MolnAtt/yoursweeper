from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
from .models import Jatek


@api_view(['GET'])
@login_required
def api_get_melyik(request, jatek_id):
    a_jatek = Jatek.objects.filter(id=jatek_id).first()
    if a_jatek==None:
        return JsonResponse('Ilyen id-val nincs jatek')
    if request.user == a_jatek.egyik:
        return JsonResponse({'melyik':'egyik'})
    if request.user == a_jatek.masik:
        return JsonResponse({'melyik':'masik'})
    return JsonResponse('te egy illetéktelen ember vagy')



@api_view(['GET'])
@login_required
def api_get_aknaszam(request, jatek_id):
    a_jatek = Jatek.objects.filter(id=jatek_id).first()
    if a_jatek==None:
        return JsonResponse('Ilyen id-val nincs jatek')
    return JsonResponse({'aknaszam':a_jatek.aknaszam})


    

