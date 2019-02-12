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

clean-all: clean-volumes clean clean-images

clean: clean-container-dist
	rm -rf ui/dist
	rm -f app/gin-bin app/app.bin

clean-container-dist: clean-ui-container-dist clean-api-container-dist

clean-ui-container-dist:
	rm -rf containers/prod/ui 

clean-api-container-dist:
	rm -rf  containers/prod/app

clean-docker:
	docker-compose down --remove-orphans
	$(CC) $(DEVDC) down --remove-orphans

clean-volumes:
	docker-compose down -v --remove-orphans
	$(CC) $(DEVDC) down -v --remove-orphans

clean-images:
	docker rmi $(shell docker image ls -q $(notdir $(shell pwd))*) || :
	docker rmi smileinnovation/imannotate:$(TAG)

test:
	go test -v ./api/... ./app/server/...
