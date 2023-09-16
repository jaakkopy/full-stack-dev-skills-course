FROM node:18-alpine3.18 as build

WORKDIR /build
COPY . .

WORKDIR ./ui
RUN npm install
RUN npm install -g @angular/cli
RUN ng build

FROM node:18-alpine3.18 as final

WORKDIR /app
COPY --from=build /build .
RUN rm -rf ./ui
RUN npm install

CMD ["npm", "run", "start"]