FROM node:10.9.0 as build
RUN mkdir -p /app

WORKDIR /app

COPY . .
RUN npm i @angular/cli@7.2.0
RUN npm install
RUN npm run build --prod

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/FormSubmit /usr/share/nginx/html