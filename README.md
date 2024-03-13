# Jet Comparison Tool

## Table of Contents

- [Run in a Self Hosted Enviornment](#run-in-a-self-hosted-enviornment)
- [Project Overview](#project-overview)
    - [Backend](#backend)
        - [Database and Primsa](#database-and-prisma)
        - [Querying Jet Data](#querying-jet-data)
        - [Route Handler](#route-handler-for-comparing-jets)
    - [Frontend](#frontend)
        - [Components](#components)
    - [Libraries](#libraries)



## Run in a Self Hosted Enviornment

This requires Docker. The easiest way to install docker is with [Docker Desktop](https://www.docker.com/products/docker-desktop/).

1. To run the project first clone it

```sh
git clone https://github.com/gavsidhu/jet-comparison-tool.git
```

2. Go into the directory 

```
cd jet-comparison-tool
```

3. Copy the example `.env.example` to `.env`

For Linux/MacOS
```sh
cp .env.example .env
```

For Windows 
```powershell
copy .env.example .env
```

4. Make sure you add a valid OpenAI API Key in the .env file

```env
OPENAI_API_KEY=YOUR_API_KEY_HERE
```

5. Install all dependencies

```sh
npm install
```

6. Start the PostgreSQL service using docker compose in detatched mode

Make sure Docker Desktop is running.

Also make sure nothing else on your system is running on or listening to port 5432. 
If there is something running on port 5432 it will cause an error when running the prisma migration and seed commands.

To check:

Linux/MacOS:
```sh
sudo lsof -i :5432
```
Windows:
```powershell
netstat -aon | findstr :5432
```

Run the Docker container:
```sh
docker compose -f docker/docker-compose.dev.yaml up -d
```


7. Run prisma command to migrate database and run the seed script
```sh
npx prisma migrate deploy && npx prisma db seed
```

8. Run the app
```sh
npm run dev
```

## Project Overview

### Backend

#### Database and Prisma

For the database, I decided to use PostgreSQL because it's the SQL database that I have the most experience with. I decided to use Docker and Docker Compose to run a PostgreSQL image because it makes it easy to develop and makes it easier to make sure everything works properly across different machines.

To seed the data I created a seed script under `primsa/seed.ts`. This script uses raw sql to copy the csv data to the PostgreSQL database. In order for this to work the csv file has to be available in the docker container. Thise is done in the `docker/docker-compose.dev.yaml file`

```yaml
volumes:
      - postgres_data:/var/lib/postgresql/data
      - /Users/gavinsidhu/Documents/Projects/jet-ai/jet_facts.csv:/data/jet_facts.csv # make sure the csv file is available in Docker container
```

#### Querying Jet Data

To load the jet data I used the `fetch` api in a server component. This data is then passed to the `Table` client component to allow for interactivity.

#### Route Handler For Comparing Jets

For the jet comparison feature I created a `POST` route handler to get the comparison criteria and the jets that need to be compared from the client. I then dynamically create the prompt for the OpenAI API.

The biggest challenge of implementing this feature was making sure that the data returned by OpenAI was consistent and predictable so I can display it properly on the client. To make the data more consistent and predictable I made sure to add how I want the data returned into the prompt and I used a fairly new feature of OpenAI's api called `JSON mode`. This makes sure the data is returned in JSON. That combined with the prompt has made the data returned fairly consistent.

Another challenge of this feature was making sure the data returned was accurate. This isn't something that I have much control over. The data accuracy for this comes from which model is used. I am using the `gpt-3.5-turbo` model because it is low cost and fast. However, I did also try the `gpt-4-turbo-preview` model. which was more accurate but it is also more expensive and slower. Another thing to keep in mind is the the `JSON mode` feature of the API is only available for certain models so I was not able to test other models.

### Frontend

For the frontend styling I used TailwindCSS as per the project requirements.

#### Components

The front end is pretty simple. The main logic is all under the `Table` component. For a project of this scope I decied to put all the logic under one component just to keep everything in one place.

This component takes a `initialJets` property which is passed in from the `page.tsx` server component.

The `Table` component allows for sorting of the jets based on the properties that were available in the csv data (wingspan, engines, manufacturing year).

When you select 2 or more jets a button and select input appear under the table that allows you compare the jets based on the selected criteria.

After clicking the button, a simple loader is shown while the data is being sent to the router handler. Once the data is returned it is loaded into another table and ranked based on the comparison criterias value.

### Libraries

The libraries I used include:
- prisma - required by project
- openai - to interact with OpenAI API
- ts-node -  to run the seed script
