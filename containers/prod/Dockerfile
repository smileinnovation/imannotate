FROM alpine

ADD app /app
ADD ui /ui

RUN apk add --no-cache ca-certificates

ENV SERVE_STATICS=true
EXPOSE 8000
CMD ["/app"]
