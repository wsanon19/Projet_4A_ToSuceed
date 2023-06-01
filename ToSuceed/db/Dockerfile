#Create MySQL Image for JSP Tutorial Application
FROM mysql
MAINTAINER sanon427@gmail.com

ENV MYSQL_ROOT_PASSWORD tosucceddev
ADD init.sql /docker-entrypoint-initdb.d

EXPOSE 3306