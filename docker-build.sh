yarn build

pushd build
unzip -d app -o app.zip
popd

docker build --tag "nest-attack-api" .
# docker run --name nest-attack --rm  -p 3000:3000 -t nest-attack-api