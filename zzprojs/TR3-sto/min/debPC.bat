set imput=C:\www\terreStudio\TR3-sto\api
set output=C:\www\terreStudio\TR3-sto\build

RMDIR %output% /S /Q
md %output%

for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set backup=D:\releases\terreStudio\TR3-sto\api\%YYYY%-%MM%-%DD%

if not exist %backup% md %backup%

TIMEOUT /T 3

FOR /R "%imput%" %%f in (*.js) DO (

 type %%f >> %output%\TR3sto.deb.js
 
)

TIMEOUT /T 3

xcopy %imput% %backup% /e /y