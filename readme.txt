docker-compose down
docker rmi crud:front
docker rmi crud:back
cd angular
docker build --tag crud:front .
cd ../springboot
docker build --tag crud:back .
cd ..
docker-compose up -d