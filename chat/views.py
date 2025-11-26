from django.shortcuts import render
from django.http import HttpRequest, HttpResponseNotAllowed, HttpResponse, HttpResponseBadRequest, HttpResponseNotFound, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from .models import Jatek



def index(request:HttpRequest):
    return render(request, "chat/index.html")


def room(request:HttpRequest, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})

def fooldal(request:HttpRequest):
    template = 'chat/index.html'
    context = {}
    return render(request, template, context)

@login_required
def ujjatek(request):
    return render(request, 'chat/ujjatek.html')

@login_required
def ujjatek_letrehozasa(request:HttpRequest):
    if request.method!='POST':
        return HttpResponseNotAllowed('esetleg nem kéne próbálkozni')
    if 'nev' not in request.POST.keys():
        return HttpResponseNotAllowed('esetleg nem kéne próbálkozni így sem')
    a_nev = request.POST['nev']
    a_jatek = Jatek.objects.filter(nev = a_nev.strip()[:100]).first()
    
    if a_jatek:
        return HttpResponseNotAllowed('Sajnálom, ilyen névvel már van játék')
    
    if 'aknaszam' not in request.POST.keys():
        return HttpResponseNotAllowed('esetleg nem kéne próbálkozni így sem')
    
    try:
        az_aknaszam = int(request.POST['aknaszam'])
    except:
        return HttpResponseNotAllowed('nem számot adtál meg, nem tudom hogy, de ezt hagyd abba')

    if  224 < az_aknaszam:
        return HttpResponseNotAllowed('Ez így egy kicsit nehéz lesz')

    if az_aknaszam < 0:
        return HttpResponseNotAllowed('Ez így egy kicsit nehéz lesz')
    
    a_jatek = Jatek.objects.create(nev = a_nev, egyik = request.user, aknaszam=az_aknaszam).first()
    return render(request, 'chat/jatek.html', {'a_jatek': a_jatek})
    

@login_required # enélkül nem tudsz request.user-re hivatkozni! # 1 pont
def jatek_join(request:HttpRequest):
    if request.method!="POST": # 1 pont
        return HttpResponseBadRequest('Ezt így nem kéne, a gombra kattints, ne linket másolj!')
    if 'jatekid' not in request.POST.keys(): # 1 pont
        return HttpResponseBadRequest('Ez valami rosszindulatú próbálkozás, mert nincs jatekid kulcs!')
    
    a_jatek = Jatek.objects.filter(id=request.POST['id']).first()

    if a_jatek == None: # 1 pont
        return HttpResponseNotFound('Nincs ilyen játék')

    # a_jatek.egyik a játék létrehozója 

    if  a_jatek.egyik == request.user: # (+1 pont)
        return HttpResponseForbidden('Nem játszhatsz magaddal.')
    
    if  a_jatek.masik != None: # 1 pont
        return HttpResponseForbidden('Lassú vagy, ezt már elhappolták')

    a_jatek.masik = request.user  #1 pont
    a_jatek.save()    

    return render(request, 'chat/jatek.html', {'a_jatek': a_jatek})






