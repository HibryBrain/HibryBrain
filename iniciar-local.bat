@echo off
cd /d "%~dp0"
echo Abre http://localhost:8000 en tu navegador.
py -m http.server 8000
if errorlevel 1 python -m http.server 8000
