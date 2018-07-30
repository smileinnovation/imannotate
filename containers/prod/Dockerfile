FROM alpine

RUN apk add --no-cache ca-certificates rsync

ADD app /app
ADD ui /ui-tmp
RUN mkdir /ui && chmod g+rw /ui /ui-tmp

ENV SERVE_STATICS=true
EXPOSE 8000
ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["/app"]
