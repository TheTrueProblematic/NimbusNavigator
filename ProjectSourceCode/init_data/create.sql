CREATE TABLE users (
                       username VARCHAR(50) PRIMARY KEY,
                       password CHAR(60) NOT NULL,
                       zipcode VARCHAR(5) NOT NULL,
                       name CHAR(50) NOT NULL
);
