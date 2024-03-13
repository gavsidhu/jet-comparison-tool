# Jet Comparison Tool

## Table of Contents

- [Installation](#run-in-a-self-hosted-enviorment)



# Run in a self hosted enviorment

1. To run the project first clone it

```sh
git clone https://github.com/gavsidhu/jet-comparison-tool.git
```

2. Go into the directory 

```
cd jet-comparison-tool
```

3. Copy the example `.env.example` to `.env`

```sh
cp .env.example .env
```

4. Make sure you add a valid OpenAI API Key in the .env file

```env
OPENAI_API_KEY=YOUR_API_KEY_HERE
```

5. Install all dependencies

```sh
npm install
```

6. Start the PostgreSQL service using docker compose in detactched mode

```sh
docker compose -f docker-compose.dev.yaml up -d
```


7. Run prisma commands to migrate database, run the seed script and generate a prisma client
```sh
npx prisma migrate dev --name init && npx prisma db seed && npx prisma generate
```

8. Run the app
```sh
npm run dev
```
