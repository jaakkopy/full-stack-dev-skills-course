FROM node:18-alpine3.18

COPY . .

RUN npm install

WORKDIR ./ui
RUN npm install -g @angular/cli
RUN ng build

WORKDIR ..

CMD ["npm", "run", "start"]