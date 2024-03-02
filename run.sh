#!/bin/bash

cd SPA
ng test --watch=false --browsers=ChromeHeadless
pkill -f "ng serve"
#if [ $? -eq 0 ]; then
    npm start
#else
#    echo "Testes unitários falharam."
#fi