FROM node:16-alpine as build

WORKDIR /usr/src/app
COPY . .
RUN npm install --force
RUN npm run build
RUN npm prune --production

FROM nginx:stable-alpine
COPY --from=build "/usr/src/app/build" "/usr/share/nginx/html"

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]