FROM node:16-alpine
WORKDIR /app
COPY package*.json .
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.22.1-alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]