yarn build

pushd build
unzip -d app -o app.zip
popd

docker build --tag "nestjs-passport-mfa-api" .
# docker run --name nestjs-passport-mfa-api --rm  -p 3000:3000 -t nestjs-passport-mfa-api