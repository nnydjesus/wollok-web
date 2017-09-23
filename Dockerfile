FROM phusion/passenger-nodejs:latest
RUN mkdir -p /usr/src/dashboard
WORKDIR /usr/src/dashboard
COPY package.json /usr/src/dashboard/
RUN npm install
COPY . /usr/src/dashboard
RUN npm run build-prod
RUN npm run build-ssr
EXPOSE 3000
CMD [ "npm", "run", "ssr" ]
