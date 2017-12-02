npm run build-prod
npm run build-ssr

rm -rf ../wollok-deploy/dist/
rm -rf ../wollok-deploy/server/
rm -rf ../wollok-deploy/public/

cp -R dist/ ../wollok-deploy/dist/
cp -R server/ ../wollok-deploy/server/
cp -R public/ ../wollok-deploy/public/

cd ../wollok-deploy
git add .
git commit -m "deploy"
git push -f origin master
cd ../wollok-web 