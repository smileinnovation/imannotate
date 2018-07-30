FROM node:10-alpine

RUN npm install -g @angular/cli

RUN apk add --no-cache python git build-base

ARG UID
ARG GID

RUN set -xe; \
  if [ $GID != "0" ]; then \
    # group is not root \
    # if GID exists (eg. OSX, gid = 20) \
    # so we add "node" user to that group either we only change node group to that GID \
    (grep ":$GID;" /etc/group && sed -i "s/.*:$GID:.*/&,node/") || sed -i 's/1000/'$GID'/g' /etc/group; \
  fi;\
  sed -i 's/1000/'$UID'/g' /etc/passwd; \
  chgrp $GID /home/node; \
  chmod g+rwx /home/node;

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 4200
USER node
