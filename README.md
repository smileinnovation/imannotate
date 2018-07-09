# Imannotate - Image annotation for Machine Learning

Recurrent Neural Networks needs to have annotated images to learn how to get object to recognize in images, that means that you need to give image and "bounding boxes" of each object to recognize when you train your model. And you will need **a lot** of annotations to ensure a good train !

Imannotate is an API and Web interface built to help to create that dataset. You will be able to manage projects and users to participate to annotation.

## Installation

To make it running in "production mode" (that means that you cannot change source code), you'll need to serve "ui" (Angular interface) and the "api" built in Golang. 

The quick method is to use our "docker-compose-prod.yml" file with Docker-Compose to startup the service:

```
make build
docker-compose -f docker-compose-prod.yml up
# then navigate to http://localhost:8000
```

If you want to manage the entire build and http server, you may use nginx as reverse proxy to the go application, and serve "ui" as static file:

```
glide install
go build main.go -o api
# start api
SERVE_STATICS=false ./api 
```

Then configure nginx (this is a untested example):

```
server {
    listen [::]:80;

    location ^~ /api {
        proxy_pass http://localhots:8000/api;
        proxy_redirect          off;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location ^~ / {
        root /var/www/imannotate/ui;
    }
}
```

## Developpers, you're welcome !

If you want to develop with us, let's take that repository and type:

```
make
```

That will use docker-compose to build images and start containers. Your uid:gid is written in a "base compose file" named .user.compose.yml to bind them inside the containers, to not have any rights problems when process writes files.

You may visit http://localhost:8080 to navigate application.

- each change in Golang sources rebuild API (using "gin")
- each change in Angular soruces refreshes the view in browser (live-reload)

You may now use docker-compose to add Angular component, install packages, or Golang packages (with glide):


```
docker-compose exec ui ng g component src/app/components/myview --dry-run
docker-compose exec ui npm install --save-dev package/to/install

docker-compose exec api glide get github.com/package/to/vendor

```

If problems with "gin" that sometimes doesn't recompile the binary, do:

```
docker-compose restart api
```
