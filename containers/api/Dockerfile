# points on latest 1.x version
FROM golang:1-alpine
RUN apk add --no-cache git mercurial musl-dev gcc make curl
RUN set -xe; \
    go get -v github.com/codegangsta/gin; \
    go get -v github.com/Masterminds/glide

RUN set -xe;\
    addgroup -g 1000 gouser; \
    adduser -u 1000 -G gouser -D gouser

RUN set -xe; \
    USER=gouser; \
    GROUP=gouser; \
    curl -SsL https://github.com/boxboat/fixuid/releases/download/v0.4/fixuid-0.4-linux-amd64.tar.gz | tar -C /usr/local/bin -xzf - ;\
    chown root:root /usr/local/bin/fixuid; \
    chmod 4755 /usr/local/bin/fixuid;\
    mkdir -p /etc/fixuid; \
    mkdir -p /go/src; \
    chown -R ${USER}:${GROUP} /go; \
    printf "user: $USER\ngroup: $GROUP\n" > /etc/fixuid/config.yml

ADD entrypoint.sh /entrypoint.sh
USER 1000
ENV GOPATH /go
ENV HOME /home/gouser
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
# Assume that workdir is set in docker-compose.yml
CMD ["gin", "run", "main.go"]


