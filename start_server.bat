@echo off

cd csfloatinspect\config

REM Check if the config generator script exists
if exist generate_config.py (
    REM Run config generator
    python generate_config.py
) else (
    echo generate_config.py not found in the config directory.
    exit /b 1
)

cd ..

REM Check if the docker_start.sh script exists
if exist docker_start.sh (
    REM Open Git Bash and run the script
    "C:\Program Files\Git\bin\bash.exe" -c "./docker_start.sh"
) else (
    echo docker_start.sh not found in the csfloatinspect directory.
    exit /b 1
)

REM Pause to keep the window open
pause
