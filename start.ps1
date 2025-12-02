# ========== virtuális környezet ebben az ablakban ==========
.\venv\Scripts\activate 

# ========== Redis (Docker) külön ablakban ==========
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "docker run --rm -p 6379:6379 redis:7"
)


# ========== Django runserver külön ablakban ==========
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    ". .\venv\Scripts\Activate.ps1; python manage.py runserver"
)

# ========== Chrome megnyitása a fejlesztői szerverhez ==========
Start-Process "chrome.exe" "http://127.0.0.1:8000/"


# ========== VSCode megnyitása a fejlesztéshez ==========
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Start-Process "code" $scriptDir
