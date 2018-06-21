

UID=$(shell id -u) 
GID=$(shell id -g) 


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

