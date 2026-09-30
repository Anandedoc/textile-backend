echo "Enter the environment: dev or test or prod"
read env

git add .
git stash
if [ "$env" = "prod" ]; then
    git checkout main
else
    git checkout develop
fi

docker compose -f docker-compose.yml -f docker-compose.$env.yml up -d --build