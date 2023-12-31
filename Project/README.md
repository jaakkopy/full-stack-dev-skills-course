# About

- The project is a web application where (logged in) users can join groups and collectively create shopping lists with whatever kinds of items they wish to add.
- The group members can view all of the group's shopping lists and add to them.
- There are also some simple statistics calculated based on all of the group's shopping lists. The stats are visualised with [Chart.js](https://www.chartjs.org/docs/latest/).
- The UI is made with [Angular](https://angular.io/).
- The server is made with [Node.js](https://nodejs.org/en) and  [Express](https://expressjs.com/).
- [MongoDB](https://www.mongodb.com/) is used as the database. ODM is added with [Mongoose](https://mongoosejs.com/)

# Link to the demo video

[here](https://lut-my.sharepoint.com/:v:/g/personal/jaakko_pyrhonen_student_lut_fi/ETHaztap1eNGiVbcg9Y8Ka0B7u3ZWHfGQD0UF2LFp1bQ5A?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0RpcmVjdCJ9fQ&e=Oa7MZ0)

# How to run the project 

## 1. Clone the repository

```
git clone https://github.com/jake52227/full-stack-dev-skills-course.git
```

## 2. Set up the .env

Create a `.env` file in the root of the `Project` folder. The file should contain the following entries:
```
SECRET=<secret string used in the database configuration>
MONGODBURI=<connection uri for MongoDB. For example "mongodb://localhost:27017/shopping" for a localhost connection on port 27017> 
JWT_SECRET=<secret string used for signing the JWTs>
JWT_EXPIRATION=<a number indicating the number of seconds the JWT should be valid. For example 86400 for one day>
```

## 3. Start mongod if you are using a localhost database

If you want to connect to a database on localhost, the mongo daemon process needs to be installed and running. If you don't have mongodb installed, install the latest version (version 7.0.1 was used for this project). If mongodb is installed, on Linux with systemctl run:
```
sudo systemctl start mongod
```

## 4. Run the project

### 4.1 Run with Docker

If you have Docker installed I'd recommend using that.

If the Docker daemon is not running, start it with:
```
sudo systemctl start docker
```

#### 4.1.1 With Docker compose

It should be enough to run this on the project's root (`Project` folder):
```
sudo docker compose up -d --build
```
This builds the container and starts it on the host network. The server should be running on http://localhost:5000.

#### 4.1.2 Without Docker compose

First, in the `Project` folder, build the image:
```
sudo docker build . -t <name for the image>
```
Start the container on the host network:
```
sudo docker run --network host -d <name of the image>
```
Now it should be up & running on http://localhost:5000.

### 4.2 Run without Docker on localhost

If you chose to not use Docker, the following steps should to be taken:
1. If you don't have node version 18 (version 18.17.1 was used during development), please install it. It's easily done with `sudo npm install -g n` and `sudo n install 18`
2. `cd` to `./ui` (in the `Project` folder).
3. If you don't have angular cli version 16 (version 16.2.1 was used during development), please install the latest version with `npm i @angular/cli` (might have to use sudo)
4. Install packages with `npm install`. 
5. Build the Angular project with `ng build`.
6. `cd` back to `Project`.
7. `npm install`.
8. `npm start` starts the project.