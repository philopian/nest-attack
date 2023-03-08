yarn build

pushd build
unzip -d app -o app.zip
popd

docker build --tag "snack-attack-api" .
# docker run -d --name snack-attack --rm  -p 3000:3000 -t snack-attack-api