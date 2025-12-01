CREATE DATABASE game;

USE game;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    userPassword BINARY(60) NOT NULL,
    powerLevel ENUM('admin', 'editor', 'normal') DEFAULT 'normal',
    salt VARCHAR(1024) NOT NULL
);


CREATE TABLE highscores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    score INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);

