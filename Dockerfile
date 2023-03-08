FROM node:18-alpine
WORKDIR /user/src/app
COPY build/app .
USER node
CMD ["npm", "run", "start"]