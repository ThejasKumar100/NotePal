FROM node:20.15.0-alpine

WORKDIR /notepal-be

COPY . /notepal-be/

RUN npm install

EXPOSE 4545

ENV NAME NotePal-BE

CMD ["npm", "start"]