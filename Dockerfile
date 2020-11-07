FROM node:14-alpine

ENV DB_CONNECT=mongodb://localhost:27017/products \
    DB_USERNAME=admin \
    DB_PASSWORD="" \
    DB_AUTHSOURCE=admin \
    TOKEN_SECRET="" \
    TOKEN_TTL=86400

EXPOSE ${PORT}

WORKDIR /app
COPY package.json .
RUN npm i
COPY src ./src

HEALTHCHECK --interval=15s --timeout=15s --start-period=30s \  
    CMD node src/healthcheck.js

CMD [ "node", "src" ]