FROM node:10-alpine

RUN npm install -g @angular/cli

ARG UID=1001
ARG GID=1001

RUN set -xe; \
  sed -i 's/1000/'$GID'/g' /etc/group; \
  sed -i 's/1000/'$UID'/g' /etc/passwd

EXPOSE 4200
USER node
