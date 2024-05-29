FROM openjdk:8-jdk-alpine
EXPOSE 8765
ADD target/springboot.jar springboot.jar
ENTRYPOINT ["java","-jar","/springboot.jar"]
