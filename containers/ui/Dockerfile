FROM node:10-alpine

RUN npm install -g @angular/cli

ARG UID
ARG GID

RUN set -xe; \
  sed -i 's/1000/'$GID'/g' /etc/group; \
  sed -i 's/1000/'$UID'/g' /etc/passwd

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 4200
USER node
