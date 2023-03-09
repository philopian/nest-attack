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
