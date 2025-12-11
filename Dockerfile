FROM node:22-alpine3.21 AS build
WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build --verbose

FROM nginx:stable-alpine3.21
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html-original
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN echo "https://dl-cdn.alpinelinux.org/alpine/v3.21/main" >> /etc/apk/repositories \
&& echo "https://dl-cdn.alpinelinux.org/alpine/v3.21/community" >> /etc/apk/repositories \
&& apk update \
&& apk add --no-cache --upgrade --repository https://dl-cdn.alpinelinux.org/alpine/v3.21/main libxml2=2.13.9-r0 libxml2-utils=2.13.9-r0 \
&& apk upgrade --no-cache \
busybox \
busybox-binsh \
ssl_client \
&& sed -i '/v3.21/d' /etc/apk/repositories

EXPOSE 8002
CMD ["nginx", "-g", "daemon off;"]
