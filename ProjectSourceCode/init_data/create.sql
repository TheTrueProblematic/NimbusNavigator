DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    name     CHAR(50)    NOT NULL,
    username VARCHAR(50) PRIMARY KEY,
    zipcode  VARCHAR(5)  NOT NULL,
    password VARCHAR(60) NOT NULL
);

-- Insert 50 fake users
INSERT INTO users (name, username, zipcode, password)
VALUES ('John Doe', 'johndoe1@example.com', '12345', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Jane Smith', 'janesmith1@example.com', '54321', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Alice Johnson', 'alicejohnson@example.com', '67890', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Bob Brown', 'bobbrown@example.com', '13579', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Carol White', 'carolwhite@example.com', '24680', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Eve Davis', 'evedavis@example.com', '11223', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Frank Miller', 'frankmiller@example.com', '33445', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Grace Wilson', 'gracewilson@example.com', '55667', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Hank Young', 'hankyoung@example.com', '77889', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Isabel Hall', 'isabelhall@example.com', '99001', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Jack King', 'jackking@example.com', '24680', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Karen Lee', 'karenlee@example.com', '13579', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Leo Scott', 'leoscott@example.com', '98765', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Mia Collins', 'miacollins@example.com', '56789', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Nina Reed', 'ninareed@example.com', '54321', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Oscar Green', 'oscareen@example.com', '24680', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Pam Adams', 'pamadams@example.com', '56789', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Quinn Wright', 'quinnwright@example.com', '78901', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Ruth Perez', 'ruthperez@example.com', '43210', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Sam Bell', 'sambell@example.com', '22334', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Tina Rivera', 'tinarivera@example.com', '33445', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Uma Foster', 'umafoster@example.com', '77889', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Vince Murphy', 'vincemurphy@example.com', '99001', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Wendy Sanders', 'wendysanders@example.com', '11223', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Xander Price', 'xanderprice@example.com', '54321', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Yara Diaz', 'yaradiaz@example.com', '24680', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Zane Black', 'zaneblack@example.com', '13579', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Amy Carter', 'amycarter@example.com', '98765', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Brian Evans', 'brianevans@example.com', '56789', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Clara Griffin', 'claragriffin@example.com', '43210', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Derek Cooper', 'derekcooper@example.com', '22334', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Ella Kim', 'ellakim@example.com', '33445', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Finn Hill', 'finnhill@example.com', '77889', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Gina Scott', 'ginascott@example.com', '99001', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Harry Ward', 'harryward@example.com', '11223', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Ivy Russell', 'ivyrussell@example.com', '54321', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Jake Hughes', 'jakehughes@example.com', '24680', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Kim Morgan', 'kimmorgan@example.com', '13579', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Liam Stewart', 'liamstewart@example.com', '98765', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Molly Brown', 'mollybrown@example.com', '56789', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Nate Scott', 'natescott@example.com', '43210', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Olivia Kelly', 'oliviakelly@example.com', '22334', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Pete Brooks', 'petebrooks@example.com', '33445', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Queen Carter', 'queencarter@example.com', '77889', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Ralph Phillips', 'ralphphillips@example.com', '99001', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Sandy Adams', 'sandyadams@example.com', '11223', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Timothy Cruz', 'timothycruz@example.com', '54321', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Uma Lopez', 'umalopez@example.com', '24680', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Victor Hall', 'victorhall@example.com', '13579', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2'),
       ('Will Young', 'willyoung@example.com', '98765', '$2y$10$rXB4Xg/iPK7jqlzfB8EylOJHDC2iB9apDuDGh9V6a4kUN.1uPUmp2');

-- Verify the entries
SELECT *
FROM users;
