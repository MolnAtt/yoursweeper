from django.shortcuts import render
from django.contrib.auth.models import Group, User

from validate_email import validate_email 

from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponse

@login_required
def pelda1(request):
    return HttpResponse('Ez a tesztüzenet1')

@login_required
@user_passes_test(lambda user : user.is_superuser)  ##  Ide bármilyen függvény jöhet, aminek egy User a paramétere, és bool-t ad vissza!
def pelda2(request):
    return HttpResponse('Ez a tesztüzenet2')

def regisztracio(request):
    if request.user.is_authenticated:
        return render(request, 'registration/visszajelzes.html', {
                    'hosszu': f'Sőt, be is van jelentkezve, {request.user.last_name} {request.user.first_name}.',
                    'rovid': 'Már regisztrált az oldalra.',
                })

    if request.method == "GET":
        return render(request, 'registration/regisztracio.html')
    
    if request.method == "POST":
        for kulcs in ['email', 'password', 'username', 'last_name', 'first_name']:
            if kulcs not in request.POST.keys():
                return render(request, 'registration/visszajelzes.html', {
                            'rovid': 'Sikertelen regisztráció',
                            'hosszu': f"A POST nem tartalmaz '{kulcs}' kulcsot",
                    })

        a_username = request.POST['username']
        az_email = request.POST['email']


        if not validate_email(az_email):
            return render(request, 'registration/visszajelzes.html', {
                        'rovid': 'Sikertelen regisztráció',
                        'hosszu': 'Ez az email-cím nem helyes. Nézze meg, nem gépelte-e el!',
                    })

        if User.objects.filter(username=a_username).exists():
            return render(request, 'registration/visszajelzes.html', {
                        'rovid': 'Sikertelen regisztráció',
                        'hosszu': 'Ezzel a felhasználónévvel már korábban regisztráltak fiókot ezen az oldalon. Próbálkozzon más email-címmel vagy használja a jelszó-emlékeztető funkciót!',
                    })
        
        a_user = User.objects.create_user(
            username = a_username,
            password = request.POST['password'],
            email = az_email,
            last_name = request.POST['last_name'],
            first_name = request.POST['first_name'],
        )

        uj_regisztralok_csoportja, _ = Group.objects.get_or_create(name='uj_regisztralo')
        a_user.groups.add(uj_regisztralok_csoportja)

        return render(request, 'registration/visszajelzes.html', {
                    'rovid': 'Sikeres regisztráció',
                    'hosszu': 'Sikeresen regisztrált fiókot.',
                })

