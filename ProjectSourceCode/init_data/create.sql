CREATE TABLE users
(
    name     CHAR(50)    NOT NULL username VARCHAR(50) PRIMARY KEY,
    zipcode  VARCHAR(5)  NOT NULL,
    password VARCHAR(60) NOT NULL,
);

-- Insert 50 fake users
INSERT INTO users (name, email, zipcode, password)
VALUES ('John Doe', 'johndoe1@example.com', '12345', 'password123'),
       ('Jane Smith', 'janesmith1@example.com', '54321', 'pass456'),
       ('Alice Johnson', 'alicejohnson@example.com', '67890', 'mysecretpass'),
       ('Bob Brown', 'bobbrown@example.com', '13579', 'password789'),
       ('Carol White', 'carolwhite@example.com', '24680', 'pass999'),
       ('Eve Davis', 'evedavis@example.com', '11223', 'qwerty123'),
       ('Frank Miller', 'frankmiller@example.com', '33445', 'mypassword1'),
       ('Grace Wilson', 'gracewilson@example.com', '55667', 'letmein321'),
       ('Hank Young', 'hankyoung@example.com', '77889', 'p@ssw0rd'),
       ('Isabel Hall', 'isabelhall@example.com', '99001', 'secure1234'),
       ('Jack King', 'jackking@example.com', '24680', 'easy2guess'),
       ('Karen Lee', 'karenlee@example.com', '13579', 'changeme'),
       ('Leo Scott', 'leoscott@example.com', '98765', 'hunter2'),
       ('Mia Collins', 'miacollins@example.com', '56789', 'welcome123'),
       ('Nina Reed', 'ninareed@example.com', '54321', 'thisisapass'),
       ('Oscar Green', 'oscareen@example.com', '24680', '12345678'),
       ('Pam Adams', 'pamadams@example.com', '56789', 'abc12345'),
       ('Quinn Wright', 'quinnwright@example.com', '78901', 'lovemypet'),
       ('Ruth Perez', 'ruthperez@example.com', '43210', 'mypassword123'),
       ('Sam Bell', 'sambell@example.com', '22334', 'sunshine123'),
       ('Tina Rivera', 'tinarivera@example.com', '33445', 'password99'),
       ('Uma Foster', 'umafoster@example.com', '77889', 'defaultpass'),
       ('Vince Murphy', 'vincemurphy@example.com', '99001', 'notsecure'),
       ('Wendy Sanders', 'wendysanders@example.com', '11223', 'ilovecats'),
       ('Xander Price', 'xanderprice@example.com', '54321', '1234abcd'),
       ('Yara Diaz', 'yaradiaz@example.com', '24680', 'ilovedogs'),
       ('Zane Black', 'zaneblack@example.com', '13579', 'test12345'),
       ('Amy Carter', 'amycarter@example.com', '98765', 'letmein2021'),
       ('Brian Evans', 'brianevans@example.com', '56789', 'hello2020'),
       ('Clara Griffin', 'claragriffin@example.com', '43210', 'mypassword1234'),
       ('Derek Cooper', 'derekcooper@example.com', '22334', 'admin123'),
       ('Ella Kim', 'ellakim@example.com', '33445', 'temporarypass'),
       ('Finn Hill', 'finnhill@example.com', '77889', 'tryagain'),
       ('Gina Scott', 'ginascott@example.com', '99001', 'password4567'),
       ('Harry Ward', 'harryward@example.com', '11223', 'abcd1234'),
       ('Ivy Russell', 'ivyrussell@example.com', '54321', 'passphrase'),
       ('Jake Hughes', 'jakehughes@example.com', '24680', '123abc456'),
       ('Kim Morgan', 'kimmorgan@example.com', '13579', 'welcome2'),
       ('Liam Stewart', 'liamstewart@example.com', '98765', 'newpassword'),
       ('Molly Brown', 'mollybrown@example.com', '56789', 'guessme'),
       ('Nate Scott', 'natescott@example.com', '43210', 'testpassword'),
       ('Olivia Kelly', 'oliviakelly@example.com', '22334', 'securepass'),
       ('Pete Brooks', 'petebrooks@example.com', '33445', 'mypassword2022'),
       ('Queen Carter', 'queencarter@example.com', '77889', 'defaultpass123'),
       ('Ralph Phillips', 'ralphphillips@example.com', '99001', 'password1010'),
       ('Sandy Adams', 'sandyadams@example.com', '11223', 'mysecretpassword'),
       ('Timothy Cruz', 'timothycruz@example.com', '54321', 'newpassword123'),
       ('Uma Lopez', 'umalopez@example.com', '24680', 'ilovecoffee'),
       ('Victor Hall', 'victorhall@example.com', '13579', 'ilovetea'),
       ('Will Young', 'willyoung@example.com', '98765', 'summer2021');

-- Verify the entries
SELECT *
FROM users;

