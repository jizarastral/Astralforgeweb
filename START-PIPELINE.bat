@echo off
title AstralForge Sleep Pipeline
cd /d "%~dp0api"

if not exist "node_modules\" (
  echo Installing API dependencies...
  call npm install --no-fund --no-audit
)

echo.
echo  ============================================
echo   AstralForge SLEEP MODE
echo   Website + AI demo + leads + money history
echo  ============================================
echo   Site:   http://127.0.0.1:8787/
echo   Admin:  http://127.0.0.1:8787/admin
echo   Health: http://127.0.0.1:8787/api/health
echo  ============================================
echo   Leave this window open. Leads + pay REFs
echo   are saved under api\data\
echo  ============================================
echo.

set PORT=8787
set NODE_ENV=production
set SERVE_STATIC=true
node src\server.js
pause
