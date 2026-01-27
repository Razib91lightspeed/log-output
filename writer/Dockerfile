FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --omit=dev

COPY index.js .

# FORCE clean entrypoint
ENTRYPOINT ["node", "index.js"]
