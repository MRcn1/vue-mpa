@echo off

echo STEP-1: install node modules ...
goto installPackage

rem ----- install node modules and run build -----
:installPackage
call cnpm install
goto build

rem ----- run build command -----
:build
echo STEP-2: run build 
call npm run build
pause
