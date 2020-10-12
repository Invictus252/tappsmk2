DROP DATABASE IF EXISTS SnippetsDB;

CREATE DATABASE SnippetsDB;

USE SnippetsDB;

CREATE TABLE Users (
  Id int NOT NULL AUTO_INCREMENT,
  Email varchar(255) UNIQUE NOT NULL,
  Password varchar(60) NOT NULL,
  UserName varchar(255) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE Snippets(
  Id int NOT NULL AUTO_INCREMENT,
  UserId int NOT NULL,
  Language varchar (255) NOT NULL,
  Description varchar (255) NOT NULL,
  Code varchar (255) NOT NULL,
  FOREIGN KEY (UserId) REFERENCES Users(Id),
  PRIMARY KEY(Id)
);

INSERT INTO Users(Email, Password, UserName) VALUES ("test","$2a$12$Wvc14igfLTDJZVXgW2cfj.40c2Rhy7FAwMFQygETtsP9fDHs2OGpa","Chester the Tester");
--INSERT INTO Users(Email, Password, UserName) VALUEs ("acb@123.com", "$2a$12$Wvc14igfLTDJZVXgW2cfj.40c2Rhy7FAwMFQygETtsP9fDHs2OGpa","Dylan");
INSERT INTO Users(Email, Password, UserName) VALUEs ("Ebsidia@gmail.com", "$2y$12$zh2Z.tyIM78dje3aMEuxV.OzvARdOoJdnmVfhE2gIkqIvZo4ZMDwe", "Ebsidia");
--INSERT INTO Users(Email, Password, UserName) VALUEs ("apples@seed.com","$2a$12$Wvc14igfLTDJZVXgW2cfj.40c2Rhy7FAwMFQygETtsP9fDHs2OGpa","Jonny");

/*INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Dylan", "SQL", "Wildcard", "SELECT * FROM Customers
WHERE City LIKE 'ber%'; ");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Dylan", "SQL", "AUTO_INCREMENT", "CREATE TABLE Persons (
  Personid int NOT NULL AUTO_INCREMENT,
  LastName varchar(255) NOT NULL,
  FirstName varchar(255),
  Age int,
  PRIMARY KEY (Personid)
); ");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Dylan", "Java", "String Length", "var txt = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var sln = txt.length; ");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Dylan", "Python", "Casting", "Python Casting");

INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Jason", "Java", "DB connect from Function Junction", "function buildSnippet(dbObject) {
  return {creator: dbObject.User, Language: dbObject.Language, description: dbObject.Description, Snip: dbObject.Snippet};}");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Jason", "C++", "Creating Pointers", "string food = 'Pizza';
 string* ptr = &food; ");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Jason", "Python", "Python Dictionaries", " thisdict =  {
  'brand': 'Ford',
  'model': 'Mustang',
  'year': 1964
}
print(thisdict)");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Jason", "Linux", "Echo into file", " echo 'hello world' > world.txt");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Jason", "Linux", "Get a list of all node process ids", "ps aux | grep node ");*/

INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES ("2", "jQuery", "Hiding", " $(this).hide();");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES ("2", "Java", "Objects", "var car = {type:'Fiat', model:'500', color:'white'};");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES ("2", "Python", "If", "a = 33
b = 200
if b > a:
  print('b is greater than a')");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES ("2", "C++", "Switch", "switch(expression) {
  case x:
    break;
  case y:
    break;
  default:
}");

/*INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("John", "Python", "Swap values between two variable", "a = 1 b = 2 a, b = b, a print(a) print");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("John", "Linux", "Change BASH prompt TEMP", "export PS1='\u >'");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("John", "C++", "Break", "for (int i = 0; i < 10; i++) {
  if (i == 4) {
    break;
  }
  cout << i << '\n';
} ");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("John", "C#", "Get User Input", "// Type your username and press enter
Console.WriteLine('Enter username:');
string userName = Console.ReadLine();
Console.WriteLine('Username is: '' + userName);");*/
