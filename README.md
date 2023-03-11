# Overview
- Example of creating a CRUD service


# Dev
```shell
$ yarn 
$ yarn start:dev
```

# Build
- Build & zip the application with only the node_modules needed for the app
  ```shell
  $ yarn build
  ```
- Create a docker container
  ```shell
  $ yarn build:docker
  ```


# PG Admin
- Go to PGAdmin to see our database, got to http://localhost:8080
  - Login with:
    ```json
    {
      name: container-postgresdb,
      host: host.docker.internal,
      database: postgres,
      user: postgres,
      password: admin
    }
    ```
- Create a `docker.env` file with
  ```shell
  POSTGRES_USER=admin
  POSTGRES_PASSWORD=admin
  POSTGRES_DB=nestjs
  PGADMIN_DEFAULT_EMAIL=admin@admin.com
  PGADMIN_DEFAULT_PASSWORD=admin
  ```



# Login flow
- Install Google Authenticator mobile app or chrome extension

- Register/login (both get a `mfa_token`)
1. [POST] {{base_url}}/authentication/register
2. [POST] {{base_url}}/authentication/login

- Enable 2Factor Auth (do this once)
  1. [POST] {{base_url}}/2fa/generate + `mfa_token`
  2. [POST] {{base_url}}/2fa/turn-on + `mfa_token`

- Get JWT accessToken
  1. [POST] {{base_url}}/2fa/authenticate + `mfa_token` + Google Authenticator code

- Make calls the the REST service
  - [GET] {{base_url}}/quotes
  - [POST] {{base_url}}/quotes











