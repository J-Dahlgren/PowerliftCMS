FROM node:14 as build
WORKDIR /var/www/power-comp
COPY . .

RUN npm install

RUN npx nx run power-comp-ui:build:cloud

RUN npx nx run power-comp-api:build:cloud

RUN ls dist/apps/power-comp/ui/assets -l

RUN npm prune --production

FROM node:14-alpine as dist

WORKDIR /var/www/power-comp

COPY --from=build /var/www/power-comp/dist ./dist

COPY --from=build /var/www/power-comp/node_modules ./node_modules

EXPOSE 3334

CMD [ "node", "./dist/apps/power-comp/api/main.js" ]