DROP DATABASE IF EXISTS TappsDB;

CREATE DATABASE TappsDB;

USE TappsDB;

CREATE TABLE SecurityQuestions (
  Id int NOT NULL AUTO_INCREMENT,
  Question varchar(255) NOT NULL,
  PRIMARY KEY(Id)
);

INSERT INTO SecurityQuestions(Question) VALUES ("What is your father's middle name?");
INSERT INTO SecurityQuestions(Question) VALUES ("What was the name of your first pet?");
INSERT INTO SecurityQuestions(Question) VALUES ("What was your first car?");
INSERT INTO SecurityQuestions(Question) VALUES ("What is your favorite video game?");
INSERT INTO SecurityQuestions(Question) VALUES ("What is your favorite programming language?");

CREATE TABLE Users (
  Id int NOT NULL AUTO_INCREMENT,
  Email varchar(255) UNIQUE NOT NULL,
  Password varchar(60) NOT NULL,
  UserName varchar(255) NOT NULL,
  AuthLevel int NOT NULL,
  SecurityQuestion1Id int NOT NULL,
  SecurityQuestion2Id int NOT NULL,
  SecurityAnswer1 varchar(255) NOT NULL,
  SecurityAnswer2 varchar(255) NOT NULL,
  FOREIGN KEY (SecurityQuestion1Id) REFERENCES SecurityQuestions(Id),
  FOREIGN KEY (SecurityQuestion2Id) REFERENCES SecurityQuestions(Id),
  PRIMARY KEY (Id)
);

INSERT INTO Users(Email,Password,UserName,AuthLevel,SecurityQuestion1Id,SecurityQuestion2Id,SecurityAnswer1,SecurityAnswer2) VALUES ("admin", "$2a$12$Ju1FK4bHNjfBBYXcJyzVquXFdMNdIeiDh4a8XTs9Tr5TNc95er/wC", "Admin",1, 1, 2, "$2a$12$1IiZalKMwnr.ZqKcVb/dNugXmAPzrvon0XazzwJe/lU91cdH9qK3W", "$2a$12$1IiZalKMwnr.ZqKcVb/dNugXmAPzrvon0XazzwJe/lU91cdH9qK3W");
INSERT INTO Users(Email,Password,UserName,AuthLevel,SecurityQuestion1Id,SecurityQuestion2Id,SecurityAnswer1,SecurityAnswer2) VALUES ("test@test.com", "$2a$12$Wvc14igfLTDJZVXgW2cfj.40c2Rhy7FAwMFQygETtsP9fDHs2OGpa", "Test", 1,1, 2, "$2a$12$1IiZalKMwnr.ZqKcVb/dNugXmAPzrvon0XazzwJe/lU91cdH9qK3W", "$2a$12$1IiZalKMwnr.ZqKcVb/dNugXmAPzrvon0XazzwJe/lU91cdH9qK3W");
