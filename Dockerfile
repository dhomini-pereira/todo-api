FROM node:22-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
RUN rm -r src
RUN mv build src
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]