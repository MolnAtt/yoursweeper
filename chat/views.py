from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.decorators import login_required



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


