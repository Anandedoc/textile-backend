FROM node:14

WORKDIR /app

ARG NODE_ENV

COPY package.json .
COPY package-lock.json .

RUN if [ "$NODE_ENV" = "dev" ]; \
        then npm install; \
        else npm install --only-production; \
        fi

COPY . .

RUN npm run build

EXPOSE 5000

CMD [ "npm", "run", "start-local" ]