![](/ui/src/assets/Logo.svg)

# Image annotation for Machine Learning

Recurrent Neural Networks needs to have annotated images to learn how to get object to recognize in images, that means that you need to give image and _bounding boxes_ of each object to recognize when you train your model. And you will need **a lot** of annotations to ensure a good train!

Imannotate is an API and Web interface built to help to create that dataset. You will be able to manage projects and users to participate to annotation.

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


## Developpers, you're welcome !

If you want to develop with us, let's take that repository and type:

```
make dev
```

That will use docker-compose to build images and start containers. Your uid:gid is written in a _base compose file_ named `.user.compose.yml` to bind them inside the containers, to not have any rights problems when process writes files.

You may visit http://localhost:8080 to navigate application.


**Important**
Because you probably want to be able to work in another directory than inside the GOPATH, you can use go-switch tool https://github.com/metal3d/goswitch


### Using GoSwitch

Install Goswitch and prepare environment to use "activate" script. Goswitch is more or less an equivalent to "Python Virtualenv".

```bash
# Install goswitch once
bash <(curl -sSL https://raw.githubusercontent.com/metal3d/goswitch/master/install.sh)

# prepare the environment inside the project
cd /path/to/imannoate
goswitch local-project .

# be able to use real github paths
make virtualenv

# to activate the environment each time you want to develop, launch tests...
source bin/activate
```


Now, everythin will be installed inside `pkg` and `src` directories.


### Or, create environment

If you want to make the environment by hand, do tha following:

```
cd /path/to/imannoate
goswitch local-project .
make virtualenv
```

Then, you need to change GOPATH and PATH each time you want to work in the project to avoid the installation outside the current project:
```
export GOPATH=$PWD:$GOPATH
export PATH=$PWD/bin:$PATH
```


### Configure your IDE/Editor

Using an IDE other that "vim" (in the current terminal session), you should set environment:

- GOPATH to imannotate directory + "src"
- PATH to imannotate directory + "bin"


### Use containers to install components


To simplify development:

- each change in Golang sources rebuild API (using _gin_)
- each change in Angular sources refreshes the view in browser (live-reload)


To enter inside a container:

```bash
# entering "ui" container where Angular resides
make enter ui
(here, you can use "ng" to create components, install packages...)


# entering "api" container where API resides
make enter api
(here you can use glide to install packages)
```

You may also use docker-compose to add Angular component, install packages, or Golang packages (with glide):


```
docker-compose -f docker-compose-dev.yaml exec ui ng g component src/app/components/myview --dry-run
docker-compose -f docker-compose-dev.yaml exec ui npm install --save-dev package/to/install
docker-compose -f docker-compose-dev.yaml exec api glide get github.com/package/to/vendor

```

Sometimes, _gin_ doesn't want to rebuild the binary, so restart _api_ container to fix:

```
docker-compose -f docker-compose-dev.yaml restart api
```
