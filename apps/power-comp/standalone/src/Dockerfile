FROM node:14 as build
WORKDIR /var/www/power-comp
COPY . .

RUN npm install

RUN npx nx build power-comp-ui --configuration=cloud

RUN npx nx build power-comp-api --configuration=cloud

RUN npm prune --production

FROM node:14-alpine

WORKDIR /var/www/power-comp

COPY --from=build /var/www/power-comp/dist ./dist

COPY --from=build /var/www/power-comp/node_modules ./node_modules

EXPOSE 3334

CMD [ "node", "./dist/apps/power-comp/api/main.js" ]