ARG NODE_VERSION=14.17.0-alpine3.13
FROM node:${NODE_VERSION}
ENV NODE_ENV=production

# Create app directory
WORKDIR /app


COPY package*.json ./

COPY . .

RUN npm ci --force --only=production



CMD [ "node", "index.js" ]
