FROM eclipse-temurin:21-jdk

WORKDIR /workspace/backend2

COPY . .

RUN apt-get update && apt-get install -y \
  git \
  maven \
  zip \
  unzip

RUN mvn clean install -DskipTests

RUN cp -r /workspace /root/

EXPOSE 8080

# CMD ["./mvnw", "clean", "package", "-DskipTests", "&&", "sleep", "infinity"]
# CMD ["java", "-jar", "target/*.jar"]
# CMD ["sleep", "infinity"]
CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.fork=false"]