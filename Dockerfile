#Stage 0, based on Node.js, to build and compile Angular
FROM node:10.3 as node
# RUN mkdir /usr/deploy


WORKDIR /app

RUN npm cache clear --force

RUN npm install -g truffle

COPY package.json /app/

RUN npm install

COPY ./ /app/

RUN truffle compile

ARG env=production

RUN npm run build --prod --aot=true -- --configuration $env

#Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.13

COPY --from=node /app/dist/football-bet /usr/share/nginx/html/football-bet
COPY --from=node /app/build /usr/share/nginx/html/build

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
