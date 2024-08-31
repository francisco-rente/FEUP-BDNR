ARG NODE_VERSION=18-alpine
FROM node:${NODE_VERSION}
ENV NODE_ENV=production
WORKDIR /app


RUN --mount=type=bind,source=package.json,target=package.json \
	--mount=type=bind,source=package-lock.json,target=package-lock.json \
	--mount=type=cache,target=/root/.npm \
	npm ci --omit=dev

USER node

COPY . . 


CMD [ "node", "index.js" ]

