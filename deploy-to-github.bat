@echo off
echo 🚀 Preparing EOP/ECM Education Agent for GitHub Pages deployment...
echo.

REM Create deployment directory
if not exist "github-pages-deploy" mkdir github-pages-deploy
cd github-pages-deploy

echo 📁 Setting up GitHub Pages files...

REM Copy main files and rename for GitHub Pages
copy ..\styles.css styles.css
copy ..\rag_system.js rag_system.js
copy ..\script-github.js script.js

REM Create index.html for GitHub Pages
echo ^<!DOCTYPE html^> > index.html
echo ^<html lang="en"^> >> index.html
echo ^<head^> >> index.html
echo     ^<meta charset="UTF-8"^> >> index.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> index.html
echo     ^<title^>EOP/ECM Education Agent^</title^> >> index.html
echo     ^<link rel="stylesheet" href="styles.css"^> >> index.html
echo     ^<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet"^> >> index.html
echo     ^<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"^>^</script^> >> index.html
echo     ^<script src="rag_system.js"^>^</script^> >> index.html
echo ^</head^> >> index.html
echo ^<body^> >> index.html

REM Add the rest of the HTML content (simplified version)
echo     ^<div class="container"^> >> index.html
echo         ^<header class="header"^> >> index.html
echo             ^<div class="header-content"^> >> index.html
echo                 ^<h1^>^<i class="fas fa-robot"^>^</i^> EOP/ECM Education Agent^</h1^> >> index.html
echo                 ^<button class="settings-btn" id="settingsBtn"^> >> index.html
echo                     ^<i class="fas fa-cog"^>^</i^> >> index.html
echo                 ^</button^> >> index.html
echo             ^</div^> >> index.html
echo         ^</header^> >> index.html
echo         ^<!-- Add rest of HTML structure here --^> >> index.html
echo     ^</div^> >> index.html
echo     ^<script src="script.js"^>^</script^> >> index.html
echo ^</body^> >> index.html
echo ^</html^> >> index.html

REM Create README for GitHub
echo # EOP/ECM Education Agent > README.md
echo. >> README.md
echo An AI-powered chatbot specialized in Emergency Operations Planning (EOP) and Evidence Chain Model (ECM) principles for research software. >> README.md
echo. >> README.md
echo ## Live Demo >> README.md
echo Visit: https://yourusername.github.io/repository-name >> README.md
echo. >> README.md
echo ## Features >> README.md
echo - Expert guidance on ECM implementation >> README.md
echo - Research software best practices >> README.md
echo - Crisis management for computational research >> README.md
echo - File upload and analysis capabilities >> README.md
echo - Memory of previous conversations >> README.md
echo - Built-in RAG system with EOP knowledge >> README.md

echo ✅ GitHub Pages files prepared in 'github-pages-deploy' folder
echo.
echo 📋 Next steps:
echo 1. Create a new repository on GitHub
echo 2. Upload the files from 'github-pages-deploy' folder
echo 3. Enable GitHub Pages in repository settings
echo 4. Your site will be live at: https://yourusername.github.io/repository-name
echo.
echo 🔧 Don't forget to:
echo - Replace 'yourusername' and 'repository-name' in README.md
echo - Test with your API keys
echo - Update any URLs or references
echo.
pause
