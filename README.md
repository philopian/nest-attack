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


