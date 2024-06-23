FROM oven/bun

EXPOSE 3000

COPY ./package.json ./bun.lockb ./
RUN bun install

ENV NODE_ENV=production

COPY . .
CMD ["bun", "run", "src/index.ts"]