@echo off
setlocal
set "SOURCE=%~dp0packs"
set "DEST=%USERPROFILE%\Downloads\FreeLife\packs"
set "MISSING="

if not exist "%SOURCE%\index.json" (
  echo No se encontro packs\index.json junto a este BAT.
  pause
  exit /b 1
)

for /L %%I in (0,1,29) do (
  if not exist "%SOURCE%\p%%I.bin" (
    echo Falta packs\p%%I.bin en el ZIP extraido.
    set "MISSING=1"
  )
)

if defined MISSING (
  pause
  exit /b 1
)

if not exist "%DEST%" mkdir "%DEST%"
if errorlevel 1 (
  echo No se pudo crear "%DEST%".
  pause
  exit /b 1
)

robocopy "%SOURCE%" "%DEST%" p*.bin index.json /COPY:DAT /R:2 /W:1 /NFL /NDL /NJH /NJS /NC /NS >nul
if errorlevel 8 (
  echo Hubo un error copiando los archivos a "%DEST%".
  pause
  exit /b 1
)

for /L %%I in (0,1,29) do (
  if not exist "%DEST%\p%%I.bin" (
    echo No se pudo verificar "%DEST%\p%%I.bin".
    pause
    exit /b 1
  )
)

echo Assets instalados en "%DEST%".
pause
exit /b 0
