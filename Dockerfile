FROM node:20.17.0

ENV PORT=80

WORKDIR /usr/src/app

# Copy build output files
COPY ./public ./public
COPY ./.next/standalone ./
COPY ./.next/standalone/node_modules ./node_modules

EXPOSE $PORT

# Running the app
CMD ["node", "server.js"]
