ARG NODE_VERSION=18
FROM node:${NODE_VERSION}
RUN apt-get update && apt-get install -y jq curl vim && apt-get clean
ENV NODE_ENV=production
WORKDIR /

# install curl

#RUN --mount=type=bind,source=package.json,target=package.json \
#	--mount=type=bind,source=package-lock.json,target=package-lock.json \
#	--mount=type=cache,target=/root/.npm \
#	npm ci --omit=dev



USER node

COPY --chown=node:node . .
RUN npm ci --omit=dev

CMD [ "npm", "start" ]

