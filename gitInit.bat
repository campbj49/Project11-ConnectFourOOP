git init
git add --all
git restore --staged gitInit.bat -f
git commit -m "first commit to GitHub"
git branch -M main
git remote add origin https://github.com/campbj49/Project11-ConnectFourOOP.git
git push -u origin main