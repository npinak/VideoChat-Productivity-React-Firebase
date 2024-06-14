# Dockerfile

# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.json ./
RUN yarn install

# start app
CMD ["yarn", "start"]

# expose port
EXPOSE 3000