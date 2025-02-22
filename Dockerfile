FROM node:20.17.0 AS runner

WORKDIR /usr/src/app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy build output files
COPY /usr/src/app/public ./public
COPY --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

EXPOSE 3000

# Running the app
CMD ["node", "server.js"]
