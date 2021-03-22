# CSV Upload service

A CSV Upload API Service, without jwt auth, without worker, with unit test

It use default hapi streaming upload with async process to insert data into mongo db

# The ideal architecture 

It should be upload file to S3 to avoid IO issue due to big files

It should fire and forget and then use S3 to trgger event in sqs

It shoudl use sqs as worker and complete the process 

## Running the app with docker

```bash
$ docker-compose --build up

```

Now you should be able to point your browser to http://127.0.0.1:3000/

