# Deployment of the stack

## Network
We will be using a docker network to allow the containers see each other
```bash
$ docker network create disxt-test-task
```

## Persistency
Create a docker volume for database persistency
```bash
$ docker volume create disxt-test-tast
```

## MongoDB container
```bash
$ docker run -d \
  --name mongodb \
  --restart on-failure:5 \
  -p 27017:27017 \
  -v disxt-test-tast:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=secr3t \
  --network disxt-test-task \
  mongo:4.4.1-bionic
```
Now we need to create an initial admin user for our database
```bash
docker exec -it mongodb-disxt-test-tast mongo admin --host localhost -u root -p secr3t --eval "db.createUser({user: 'admin', pwd: 'secr3t', roles: [{role: 'readWrite', db: 'products'}]});
```


## API container
### Build the image
```bash
$ docker build -t disxt-test-task .
```

### Run the container
We can pass this variables to the container to set it up
|Variable|Default|Description|
|-|-|-|
|DB_CONNECT|mongodb://localhost:27017/products|Mongoose style URI for the database |
|DB_USERNAME|admin|Any valid username with access to the products database, see previous step|
|DB_PASSWORD||Password for the provided user|
|DB_AUTHSOURCE|admin|Authority source to validate the user|
|TOKEN_SECRET||Secret used to sign JWT tokens|
|TOKEN_TTL|86400|Token time to live, defaults to 1 day|

**DB_PASSWORD** and **TOKEN_SECRET** are mandatory. Despite **DB_CONNECT** has a default value, we must especify the correct one depending on where the database is running.

```bash
$ docker run -it --rm \
  --name test-task \
  --network=disxt-test-task \
  -e DB_PASSWORD=secr3t \
  -e TOKEN_SECRET=karaipyhare \
  -e DB_CONNECT=mongodb://mongodb:27017/products \
  -p 3000:3000 \
  disxt-test-task
```
