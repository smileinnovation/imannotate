UID = $(shell id -u)
GID = $(shell id -g)
CC  = docker-compose

TAG="latest"
DEVDC=-f docker-compose-dev.yaml


prod: .env build
	docker-compose up

dev: .env
	$(CC) $(DEVDC) up --remove-orphans --build

.env:
	echo "_GID=$(_GID)" >  $@
	echo "_UID=$(_UID)" >> $@

build: .env containers/prod/app containers/prod/ui
	# build the needed images to build ui and go binary
	$(CC) $(DEVDC) build
	# tag imannotate image
	cd containers/prod/ && docker build -t smileinnovation/imannotate:$(TAG) .

enter-api:
	$(CC) $(DEVDC) exec api sh

enter-ui:
	$(CC) $(DEVDC) exec ui sh

containers/prod/ui:
	$(CC) $(DEVDC) run --rm ui ng build --prod
	mv ui/dist containers/prod/ui

containers/prod/app:
	echo 'go build -ldflags "-linkmode external -extldflags -static" -o app.bin' > app/builder.sh
	$(CC) $(DEVDC) run --rm api sh ./builder.sh
	mv app/app.bin containers/prod/app
	rm app/builder.sh


# remove all, volumes, dist, binaries and images
clean-all: clean-volumes clean clean-images


# remove dists and binariez
clean: clean-container-dist
	rm -f app/builder.sh
	rm -rf ui/dist
	rm -f app/gin-bin app/app.bin

# remove containers to build dis
clean-container-dist: clean-ui-container-dist clean-api-container-dist

clean-ui-container-dist:
	rm -rf containers/prod/ui 

clean-api-container-dist:
	rm -rf  containers/prod/app


# remove containers (not images) and orphanss
clean-docker:
	docker-compose down --remove-orphans
	$(CC) $(DEVDC) down --remove-orphans

# remove containers (not images) and orphans + volumes
clean-volumes:
	docker-compose down -v --remove-orphans
	$(CC) $(DEVDC) down -v --remove-orphans


# remove images
clean-images:
	docker rmi $(shell docker image ls -q $(notdir $(shell pwd))*) || :
	docker rmi smileinnovation/imannotate:$(TAG)


virtualenv:
	mkdir -p ./src/github.com/imannotate
	ln -sf $$PWD/app ./src/github.com/imannotate/app
	ln -sf $$PWD/api ./src/github.com/imannotate/api
	@echo "Environment ready to be used with goswitch or with GOPATH=\$$GOPATH:\$$PWD and PATH=\$$PATH:\$$PWD/bin"

test:
	go test -v ./api/... ./app/server/...
