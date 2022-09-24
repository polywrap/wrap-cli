FROM node:16-alpine
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build
EXPOSE ${HTTP_SERVER_PORT:-3500}
CMD ["npm", "run", "start"]