FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY index.js .
CMD ["node", "index.js"]