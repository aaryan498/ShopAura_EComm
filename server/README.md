## To Install nestjs globally,
> Required to use nest commands like "nest g module <module-name>"

```bash
npm i -g @nestjs/cli
```


## To setup completer server with Nestjs (default TypeScript)
```bash 
nest new <project-name (server)>
```


## To setup prismaORM with PostgreSQL(pg)
```bash
npm i prisma@latest @prisma/client@latest @prisma/config @prisma/adapter-pg pg
<!-- To generate prisma config files. -->
npx prisma init
```

## Writing Schema/Models
> We have to write all the models inside file `schema.prisma` in prisma folder.

## When done with writing schemas in schema.prisma, run :
```bash
npx prisma generate
```

Once written all models inside it, run:
```bash
npx prisma migrate dev --name init
```


NOTE: 
Use this in `schema.prisma`:
```
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
  moduleFormat = "cjs"
}
```





# Authentication

## 1. Install following packages:
```bash
npm i @nestjs/jwt @nestjs/config @nestjs/passport bcrypt class-validator class-transformer
```

## For DTOs, remember to install:
```bash
npm i class-validator
```


## For getting swagger:
```bash
npm i @nestjs/swagger
```
> It is used to generate swagger docs, which contains all the routes and their details.



