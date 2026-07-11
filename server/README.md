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

Once written all models inside it, run:
```bash
npx prisma migrate dev --name init
```