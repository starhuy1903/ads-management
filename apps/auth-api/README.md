# Guide

## How to run auth-api services

1. Go to this auth-api directory from root
```shell
cd apps/auth-api
```

2. Run docker-compose.yml file to run the database - using postgres
```shell
docker compose up -d --build
```

3. Push the database schema (defined in the prisma folder) to the running database (the one running via docker)
```shell
npx prisma db push
```

4. Run the auth-api service with 2 ways:
- Run this command:
```shell
pnpm exec nx run auth-api:serve --configuration=development
```

or

- Run via Nx extension

5. Bonus
- Can use this command to explore the database - In the auth-api directory ~/apps/auth-api
```shell
npx prisma studio
```