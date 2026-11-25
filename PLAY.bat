@echo off
set "STORY=%~dp0index.html"
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
  start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "%STORY%"
) else (
  start "" "%STORY%"
)
