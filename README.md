<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Execute in dev

1. Clone repository
2. Execute
```
npm install
```
3. Install Nest CLI
```
npm install -g @nestjs/cli
```
4. Get Docker-compose Up
```
docker-compose up -d
```
5. Clone __.env.template__ and rename copy to __.env__
6. Complete __.env__ variables
7. Run app:
```
npm run start:dev
```
8. Rebuild database with seed
```
Request GET to http://localhost:3000/api/v2/seed
```

# Prod Build
1. Create file __.env.prod__
2. Declare prod env variables
3. Create docker image
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

## Stack
* MongoDB
* Nest
* Mongoose

# Notas
Redeploy Heroku
```
git commit --allow-empty -m "Trigger Heroku Deploy"
git push heroku main
```