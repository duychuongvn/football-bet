FROM ubuntu:18.04
MAINTAINER kenshin
LABEL Description="This image is used to start server" Vendor="Vuejs Products" Version="1.0"

ENV NVM_PATH https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh
ENV NODE_VERSION 9.5.0
ENV NVM_DIR /usr/local/nvm
ENV NGINX_SITES_AVAILABLE /etc/nginx/sites-available/default
ENV SOURCE_PATH /var/www/html
ENV DIR_NAME /tmp/fbb_frontend

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Update CORE Ubuntu
RUN apt-get update -y && apt-get install curl vim nginx git python build-essential -y && apt-get -y autoclean

RUN mkdir $NVM_DIR
RUN mkdir $DIR_NAME

# Install nvm with node and npm
RUN curl -o- $NVM_PATH | bash

# install node and npm
# RUN source $NVM_DIR/nvm.sh \
#    && nvm install $NODE_VERSION \
#    && nvm alias default $NODE_VERSION \
#    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# install yarn
RUN npm install -g yarn@1.7.0

ADD nginx/default ${NGINX_SITES_AVAILABLE}
RUN service nginx restart

WORKDIR $DIR_NAME
COPY . .

RUN pwd && ls -l

RUN yarn install && yarn sync:data && yarn build

RUN cp -r /tmp/fbb_frontend/dist /var/www/html/
RUN rm -rf /tmp/*

WORKDIR $SOURCE_PATH

# Define default command.
CMD nginx -g "daemon off;"
