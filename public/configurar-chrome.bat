@echo off
chcp 65001 >nul
echo ==================================================
echo   CONFIGURADOR AUTOMATICO - IMPRESSAO AUTOMATICA
echo ==================================================
echo.
echo Criando atalho do Google Chrome com Kiosk Printing na sua Área de Trabalho...

powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Desktop = [Environment]::GetFolderPath('Desktop'); $Path = $Desktop + '\Google Chrome (Impressao Automatica).lnk'; $ChromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'; if (!(Test-Path $ChromePath)) { $ChromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }; if (!(Test-Path $ChromePath)) { $ChromePath = '${env:LOCALAPPDATA}\Google\Chrome\Application\chrome.exe' }; $Shortcut = $WshShell.CreateShortcut($Path); $Shortcut.TargetPath = $ChromePath; $Shortcut.Arguments = '--kiosk-printing'; $Shortcut.Save()"

echo.
echo ==================================================
echo CONCLUIDO COM SUCESSO!
echo ==================================================
echo Um novo atalho chamado "Google Chrome (Impressao Automatica)" 
echo foi criado na sua Área de Trabalho.
echo.
echo Use sempre esse novo ícone para abrir o sistema de delivery!
echo.
pause