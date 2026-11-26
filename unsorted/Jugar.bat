@echo off
rem Sirve el juego en localhost (file:// rompe cosas) y lo abre en el browser.
cd /d "%~dp0"
start "" http://127.0.0.1:8765/game.html
python -m http.server 8765 --bind 127.0.0.1
