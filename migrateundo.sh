echo "Enter the environment: dev or prod"
read env

npx sequelize-cli db:migrate:undo --env $env