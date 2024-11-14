FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
ADD . .
RUN npx prisma generate
RUN npm run build
RUN rm -rf src
RUN mv build src
RUN npm install --only=prod
CMD ["npm", "start"]