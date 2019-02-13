![](/ui/src/assets/Logo.svg)

# Image annotation for Machine Learning

Convolutional Neural Networks require annotated images to learn how to get recognize objects in images, which means that you need to give both the image and _bounding boxes_ of each object to recognize when you train your model. And you will need **a lot** of annotations to ensure a good train!

Imannotate is an API and Web interface built to help to create that dataset. You will be able to manage projects and users can participate in annotation.

## Installation

### Docker-compose _built_ mode

We provide a way to launch a _built_ Imannotate instance. This one build the Application (in Go) + UI with Angular, and provides a Docker image named `smileinnovation/imannotate`.

The quick method is to use our `docker-compose.yml` file with Docker-Compose to startup the service - use the Makefile at least one time to let the build process to be done:

```bash
make
# or make prod (that is the default)

# then navigate to http://localhost:8080
```

Next time, you can only use "docker-compose up" command.

If you want to rebuild images for production, use `make build` then you can use "docker-compose up". Or, the easiest way is to call `make` that rebuild and start the service.


### Cleaning up

If something goes wrong or if you want to remove images and/or data, you can use:

```bash
# that removes binaries, compiled ui, containers and images
make clean

# that removes binaries, compiled ui, containers, images and **volumes**
# so the databases will be empty !
make clean-all
```

### Build your own

If you want to build application, you'll need:

- Go v1.10+
- Node 10.5+
- **MongoDB** running somewhere (this is the default storage)

We will install imannotate in /var/www to be able to use Nginx.

#### Build go application

You may use Glide to get vendors, so you need to install it first:

```
curl https://glide.sh/get | sh
```


Then, get vendors packages:

```
glide install
```


Afterward, you can compile imannotate

```
go build ./app/main.go -o imannotate
```

**Move it to `/var/www/imannotate/` directory.**

Now you're able to launch application. It serves API and may serve UI as soon as you compiled it.

#### Build UI

UI needs Node and Angular 6+.

```
npm install -g @angular/cli
```


To compile a _production_ distribution, go in `/ui` directory and type:

```
npm install
ng build --prod
```


**You may now copy `dist` directory somewhere else, for example `/var/www/imannotate/ui`**

#### Launch imannotate

First, check if everything is ok by serving Imannotate in _full stand alone mode_ (that means that imannotate can serve Angular application):

```
SERVE_STATICS=true ./imannatote
```

Check http://localhost:8000/ if the interace responds. You should see normal interface (logos, decorations). Imannotate can work as is, but it's recommended to use a reverse proxy to take advantage of caches, SSL, better routing, ...


To use Nginx, stop previous run (CTRL+C) and relaunch without `SERVE_STATICS` option:

```
SERVE_STATICS=false ./imannotate
```

Now, visiting http://localhost:8000 should not work, but you can try http://localhost:8000/health that must responds correctly. You're readdy to configure NGinx.


#### Configure nginx

Then configure nginx:

```
server {
    listen [::]:80;
    listen 80;

    # serve application routes
    location ^~ /api {
        proxy_pass http://127.0.0.1:8000/api;
        proxy_redirect          off;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # serve Angular dist, static files and so on...
    location ^~ / {
        root /var/www/imannotate/ui;
        index index.html index.htm;
        try_files $uri $uri/ /index.html =404;
    }
}

```


## Developers, you're welcome !

If you want to develop with us, let's take that repository and type:

```
make dev
```

That will use docker-compose to build images and start containers. Your uid:gid is written in a _base compose file_ named `.user.compose.yml` to bind them inside the containers, to not have any rights problems when process writes files.

You may visit http://localhost:8080 to navigate application.

To simplify development:

- each change in Golang sources rebuild API (using _gin_)
- each change in Angular sources refreshes the view in browser (live-reload)

You may now use docker-compose to add Angular component, install packages, or Golang packages (with glide):


```
docker-compose -f docker-compose-dev.yaml exec ui ng g component src/app/components/myview --dry-run
docker-compose -f docker-compose-dev.yaml exec ui npm install --save-dev package/to/install
docker-compose -f docker-compose-dev.yaml exec api glide get github.com/package/to/vendor

```

Sometimes, _gin_ doesn't want to rebuild the binary, so restart _api_ container to fix:

```
docker-compose -f docker-compose-dev.yaml restart api
```
