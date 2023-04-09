@echo off
setlocal
start cmd /c "pnpm -F chatgpt-app-service dev%1"
start cmd /c "pnpm dev%1"
exit
