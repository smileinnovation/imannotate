# points on latest 1.x version
FROM golang:1-alpine
RUN apk add --no-cache git
RUN set -xe; \
    go get -v github.com/codegangsta/gin; \
    go get -v github.com/Masterminds/glide

ARG GID
ARG UID
RUN set -xe; \
    addgroup -g $GID gouser; \
    adduser -s /bin/sh -G gouser -u $GID gouser -D; \
    mkdir -p /go/src; \
    chown -R gouser:gouser /go;


ADD entrypoint.sh /entrypoint.sh
USER gouser
ENV GOPATH /go
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
# Assume that workdir is set in docker-compose.yml
CMD ["gin", "run", "main.go"]


