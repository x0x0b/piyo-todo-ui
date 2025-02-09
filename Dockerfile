# Build
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production
FROM nginx:stable AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY conf/nginx.conf /etc/nginx/templates/nginx.conf.template
EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst '$BACKEND_URL $SERVER_NAME' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
