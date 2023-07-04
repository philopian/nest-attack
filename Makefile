

# DEVELOPMENT
dev:
	docker-compose up -d postgres
	dockerize -wait tcp://localhost:5432 -timeout 1m
	docker-compose up -d
	yarn prisma
	yarn start:dev

dev-down:
	docker-compose down

dev-cleanup:
	docker-compose down --volumes --remove-orphans

key:
	node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"


build:
	yarn build

	pushd build
	unzip -d app -o app.zip
	popd

	docker build --tag "nestjs-passport-mfa-api:0.0.1" .
	# docker run --name nestjs-passport-mfa-api --rm  -p 3003:3003 -t nestjs-passport-mfa-api


# # PRODUCTION VERSION OF THE REST SERVICE
# build:
# 	docker-compose -f docker-compose.yml build --no-cache

# prod:
# 	docker-compose -f docker-compose.yml up

# cleanup:
# 	docker-compose -f docker-compose.yml down --volumes --rmi all --remove-orphans






# yarn build