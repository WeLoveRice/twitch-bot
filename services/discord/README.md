# Discord service

### ORM Auto generation

Using sequelize-auto we can automatically generate the model files using the following command:

`npx sequelize-auto -o "./models" -d lol -h localhost -c ./sequelize.json -e postgres --cm p --cf p -l ts`