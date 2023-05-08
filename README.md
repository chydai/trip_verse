# TripVerse

TripVerse is a useful tool for saving time and effort in organizing a trip. It helps travelers keep track of their itinerary and stay organized during the trip. As a social-based trip planner application, TripVerse would address this need by offering a collaborative and communicative platform for trip planning and social networking.

---
## Installing / Getting started

### Setting up local development

#### Clone the project

Our project is hosted on GitHub, and you can clone the project to your local machine by running the following command. 

```bash
  git clone https://github.com/cs421sp23-homework/sp23-oose-project-team-12.git
```

#### Set frontend

```bash
  cd reactjs-app
  npm install
  npm start
```
       
#### Set backend

You can use the `.env` file provided in the slack channel to set up the MongoDB Atlas database. Put the `.env` file in the `nodejs-app` folder.

```bash
  cd nodejs-app
  npm install
  npm start
```

### Start Project

After setting up, the frontend will run in `http://localhost:3000/`. As the continuous deployed backend is running on Heroku `https://api.ourtripverse.com/`. If the backend is running properly, you should see a `Hello World!` message. You can use the api to test the frontend. 

Also, you can test the local backend by accessing `http://localhost:8080/`.

---
## Developing

### CI/CD

We use GitHub Actions to build and deploy our project. The workflow is triggered when a pull request is created or merged into the `DEV` or `main` branch. The workflow will build the frontend and backend. And deploy the backend to Heroku, and the frontend to Vercel.

Our CI/CD setup files are located in the `.github/workflow` folder.

#### Continuous Deployment

For the best user experience, we recommend accessing the following website using the latest Chrome, Firefox, or Edge versions.

* https://home.ourtripverse.com

* If you want to try the development version, the backend preview is running on https://sp23-oose-project-team-12-git-dev-sp23-oose-project-team-12.vercel.app

To test our backend API, please follow the link provided below. If the backend is running properly, you should see a `Hello World!` message.

* https://api.ourtripverse.com

### Setting up dev development

Our project is built with MERN stack, using MongoDB Atlas as the database, ReactJS as the frontend framework, and ExpressJS as the backend framework.

| Development Tool | Version |
| --- | --- |
| NodeJS | 16.19.1 |
| mongoose | 6.9.1 |
| ReactJS | 18.2.0 |
| ExpressJS | 4.18.2 |

#### Clone the project

Our project is hosted on GitHub, and you can clone the project to your local machine by running the following command. Normally, you should clone the `DEV` branch if you want to develop the project. Our `main` branch is for production, and will be updated after the `DEV` branch is stable by the end of each iteration.

```bash
  git clone https://github.com/cs421sp23-homework/sp23-oose-project-team-12.git

  git checkout dev
```

#### Set MongoDB Atlas

We use MongoDB Atlas as the database, so you need to set up the database first. You should copy your own connection string to the `./nodejs-app/.env` file. 

You can refer to the [MongoDB Atlas documentation](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/#connect-to-a-cluster) to set up the database.

#### Start Project

After setting up, the frontend will run in `http://localhost:3000/`. As the continuous deployed backend is running on Heroku `https://api.ourtripverse.com/`. If the backend is running properly, you should see a `Hello World!` message. You can use the api to test the frontend. And the local backend will run in `http://localhost:8080/`.

### Run tests

#### Run frontend tests

You can find the test files in the `./reactjs-app/src/tests` folder. And run the following command to run the tests. 

```bash
  cd reactjs-app
  npm test
```

#### Run backend tests

You can find the test files in the `./nodejs-app/tests` folder. And run the following command to run the tests.

```bash
  cd nodejs-app
  npm test
```

