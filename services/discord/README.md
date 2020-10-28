# Discord service

### ORM Auto generation


Firstly create `./sequelize.json` file and fill in the following:
```json{
    "database": "lol",
    "username": "",
    "password": "",
    "options": {
        "host": "localhost",
        "dialiect": "postgres"
    }
}```

Using sequelize-auto we can automatically generate the model files using the following command:

`npx sequelize-auto -o "./models" -d lol -h localhost -c ./sequelize.json -e postgres --cm p --cf p --cp c -l ts`

