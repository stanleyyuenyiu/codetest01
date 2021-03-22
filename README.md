# CSV Upload service

A CSV Upload API Service, without jwt auth, without worker, with unit test

It use default hapi streaming upload with async process to insert data into mongo db

If there is enough time, the architecture should be using aws api-gateway, and aws cognito id pool for authenication, and connect to lambda for the api, and using sqs for worker, final, should send success or fail report to user by SES

## Requirements

 - [Node.js](http://nodejs.org/download/) `>=12.x` 
 - [MongoDB](http://www.mongodb.org/downloads) `>=2.6` 



## Install dependencies

```bash
$ yarn install

# > node server.js

```

## Running the app

```bash
$ yarn dev

```

## Running the app with docker

```bash
$ docker-compose --build up

```

Now you should be able to point your browser to http://127.0.0.1:3000/

