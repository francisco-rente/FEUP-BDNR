ARG NODE_VERSION=14.17.0-alpine3.13
FROM node:${NODE_VERSION}
ENV NODE_ENV=production

# Create app directory
WORKDIR /app


COPY package*.json ./

COPY . .

RUN npm ci --force --only=production

HEALTHCHECK --interval=12s --timeout=12s --start-period=30s \  
    CMD node healthcheck.js
EXPOSE 3000


CMD [ "npm", "start" ]
