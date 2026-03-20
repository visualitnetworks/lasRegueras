set src=C:\www\terreStudio\TR3-sto\build


uglifyjs %src%\TR3sto.deb.js -o %src%\TR3sto.min.js --compress --mangle reserved=['L']