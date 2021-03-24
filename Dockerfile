# This stage installs our modules
FROM mhart/alpine-node:14

RUN mkdir /build
WORKDIR /build

COPY . .

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python3

RUN yarn install --frozen-lockfile --prefer-offline --cache-folder ./cache
RUN yarn build:client

CMD ["yarn", "start:server"]
