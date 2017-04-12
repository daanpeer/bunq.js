FROM node:7.8.0-alpine

ENV APP_DIR /app/

RUN apk update
RUN apk add openssl --no-cache
RUN apk add alpine-sdk
RUN apk add python

# Give npm a $HOME to work with
ENV HOME /tmp/

ENV NPM_CONFIG_LOGLEVEL warn

# Expose local server port
EXPOSE 9000

WORKDIR $APP_DIR

# Command must be explicitly set
CMD yarn run ${command:-start}

