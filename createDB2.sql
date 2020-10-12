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


INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (3, "SQL", "Wildcard", "SELECT * FROM Customers
WHERE City LIKE 'ber%'; ");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (3, "SQL", "AUTO_INCREMENT", "CREATE TABLE Persons (
  Personid int NOT NULL AUTO_INCREMENT,
  LastName varchar(255) NOT NULL,
  FirstName varchar(255),
  Age int,
  PRIMARY KEY (Personid)
); ");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (3, "Java", "String Length", "var txt = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var sln = txt.length; ");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (3, "Python", "Casting", "Python Casting");

INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (2, "Java", "DB connect from Function Junction", "function buildSnippet(dbObject) {
  return {UserId: dbObject.User, Language: dbObject.Language, description: dbObject.Description, Snip: dbObject.Snippet};}");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (2, "C++", "Creating Pointers", "string food = 'Pizza';
 string* ptr = &food; ");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (2, "Python", "Python Dictionaries", " thisdict =  {
  'brand': 'Ford',
  'model': 'Mustang',
  'year': 1964
}
print(thisdict)");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (2, "Linux", "Echo into file", " echo 'hello world' > world.txt");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (2, "Linux", "Get a list of all node process ids", "ps aux | grep node ");

INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (1, "jQuery", "Hiding", " $(this).hide();");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (1, "Java", "Objects", "var car = {type:'Fiat', model:'500', color:'white'};");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (1, "Python", "If", "a = 33
b = 200
if b > a:
  print('b is greater than a')");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (1, "C++", "Switch", "switch(expression) {
  case x:
    break;
  case y:
    break;
  default:
}");

INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (4, "Python", "Swap values between two variable", "a = 1 b = 2 a, b = b, a print(a) print");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (4, "Linux", "Change BASH prompt TEMP", "export PS1='\u >'");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (4, "C++", "Break", "for (int i = 0; i < 10; i++) {
  if (i == 4) {
    break;
  }
  cout << i << '\n';
} ");
INSERT INTO Snippets(UserId, Language, Description, Code)
VALUES (4, "C#", "Get User Input", "// Type your username and press enter
Console.WriteLine('Enter username:');
string userName = Console.ReadLine();
Console.WriteLine('Username is: '' + userName);");
