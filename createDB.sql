DROP DATABASE IF EXISTS SnippetsDB;

CREATE DATABASE SnippetsDB;

USE SnippetsDB;

CREATE TABLE Snippets(
  Id int NOT NULL AUTO_INCREMENT,
  Creator varchar (255) NOT NULL,
  Language varchar (255) NOT NULL,
  Description varchar (255) NOT NULL,
  Code varchar (255) NOT NULL,
  PRIMARY KEY(Id)
);

INSERT INTO Snippets(Creator, Language, Description, Code)
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
INSERT INTO Snippets(Creator, Languag, Description, Code)
VALUES ("Jason", "Python", "Python Dictionaries", " thisdict =  {
  'brand': 'Ford',
  'model': 'Mustang',
  'year': 1964
}
print(thisdict)");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Jason", "Linux", "Echo into file", " echo 'hello world' > world.txt");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Jason", "Linux", "Get a list of all node process ids", "ps aux | grep node ");

INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Josh", "jQuery", "Hiding", " $(this).hide();");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Josh", "Java", "Objects", "var car = {type:'Fiat', model:'500', color:'white'};");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Josh", "Python", "If", "a = 33
b = 200
if b > a:
  print('b is greater than a')");
INSERT INTO Snippets(Creator, Language, Description, Code)
VALUES ("Josh", "C++", "Switch", "switch(expression) {
  case x:
    break;
  case y:
    break;
  default:
}");


INSERT INTO Snippets(Creator, Language, Description, Code)
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
Console.WriteLine('Username is: '' + userName);");
