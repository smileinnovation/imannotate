

UID=$(shell id -u) 
GID=$(shell id -g) 

TAG="latest"

define usercompose
version: "2.1"
services:
  base_config:
    build:
      args:
        GID: $(GID)
        UID: $(UID)
endef
export usercompose


run: .user.compose.yml
	docker-compose up --remove-orphans --build 

.user.compose.yml:
	@echo "$$usercompose" > $@
	echo $@ created

build: .user.compose.yml containers/prod/app containers/prod/ui
	docker-compose build
	cd containers/prod/ && docker build -t smileinnovation/imannotate:$(TAG) .

containers/prod/ui:
	docker-compose run --rm ui ng build --prod
	mv ui/dist containers/prod/ui

containers/prod/app:
	echo 'go build -ldflags "-linkmode external -extldflags -static" -o app.bin' > builder.sh
	docker-compose run --rm api sh ./builder.sh
	mv app.bin containers/prod/app
	rm builder.sh


clean: clean-container-dist
	rm -rf ui/dist
	rm -f gin-bin app.bin

clean-container-dist: clean-ui-container-dist clean-api-container-dist

clean-ui-container-dist:
	rm -rf containers/prod/ui 

clean-api-container-dist:
	rm -rf  containers/prod/app

clean-docker:
	docker-compose down --remove-orphans

clean-volumes:
	docker-compose down -v --remove-orphans

test:
	go test -v ./api/... ./app/server/...
