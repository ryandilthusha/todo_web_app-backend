drop database if exists todo;

CREATE database todo;

USE todo;

CREATE TABLE task (
    id INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(255) NOT NULL
);

INSERT INTO task (description) VALUES ('My test Task');
INSERT INTO task (description) VALUES ('Another Task');