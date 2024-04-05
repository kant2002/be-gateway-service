FROM node:18-alpine as node-first
WORKDIR /home/node/app
COPY package-lock.json package.json ./
RUN npm install

FROM node-first as builder
COPY . .
RUN apk add --no-cache protoc
RUN apk add --no-cache protobuf-dev
RUN npm run build

FROM node:18-alpine
EXPOSE 8080
CMD npm run start
RUN apk add --no-cache tzdata mongodb-tools bash openssl protoc
RUN apk add --no-cache protobuf-dev
WORKDIR /home/node/app
RUN cp /usr/share/zoneinfo/Europe/Kiev /etc/localtime
COPY --from=builder /home/node/app/.dockerignore /home/node/app/.dockerignore
COPY --from=builder /home/node/app/.eslintignore /home/node/app/.eslintignore
COPY --from=builder /home/node/app/.prettierignore /home/node/app/.prettierignore
COPY --from=builder /home/node/app/migrate-mongo-config.ts /home/node/app/migrate-mongo-config.ts
COPY --from=builder /home/node/app/migrations /home/node/app/migrations
COPY --from=builder /home/node/app/package-lock.json /home/node/app/package-lock.json
COPY --from=builder /home/node/app/package.json /home/node/app/package.json
COPY --from=builder /home/node/app/scripts /home/node/app/scripts
COPY --from=builder /home/node/app/tests /home/node/app/tests
COPY --from=builder /home/node/app/tsconfig.json /home/node/app/tsconfig.json
COPY --from=builder /home/node/app/node_modules /home/node/app/node_modules
COPY --from=builder /home/node/app/dist /home/node/app/dist
COPY --from=builder /home/node/app/apiDocs /home/node/app/apiDocs
COPY --from=builder /home/node/app/cabinetProcessCodesTemplates /home/node/app/cabinetProcessCodesTemplates
COPY --from=builder /home/node/app/eResidentProcessCodesTemplates /home/node/app/eResidentProcessCodesTemplates
COPY --from=builder /home/node/app/eResidentFaq.json /home/node/app/eResidentFaq.json
COPY --from=builder /home/node/app/errorTemplates.json /home/node/app/errorTemplates.json
COPY --from=builder /home/node/app/faq.json /home/node/app/faq.json
