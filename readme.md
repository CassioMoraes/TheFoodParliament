# The Food Parliament

Please for evaluation purpose use the branch CodeChallange.
The following project is a code challenge for PragmaTeam.

## Getting started

In order to run the project is necessary to install npm packages in both client/server folders using:
```
npm install
```
then in the server folder execute:
````
node src/server
`````

The tests can be run using:
````
npm test
````

### What are the highlights of your logic/code writing style?

The highlights of my coding style are the separation of concerns and the cleanness of the code. I build the server using the MVC pattern, so the server is not coupled with the view, that way it can be used either in a native mobile app as in a web app. I also used TDD so most of my code are covered with tests.
While coding I tried to apply the clean code principles and the SOLID principles, in my opinion the value of this principles is universal in the programming world, independent of programming language or the architecture chosen.

### What could have been done in a better way?

Bellow is a list of improvements and other functionalities that are missing for a 'real' product:
- The time control of my code has flaws related with time zone.
- In case of draw between two or more candidates the last of the list is the winner.
- Implement a proper serialization method, currently the data is write/read in a json file, but I left the repository read to acept the database implemntation, so there is just one place that need to be changed in that case.
- The restaurant list in being fetched with Google places API, but the location is hardcoded.
- The user Id is populate by the user name in a text box, so some sort of login or other identification is required.
- The layout is really bad.

### Any other notes you judge relevant for the evaluation of your project.

Most of my working experience with programming comes from C#, I also worked with Javascript/AngularJS in professional and personal projects, but this is my first experience with Node.js, I intend to keep learning and using this code challenge project as a playground, for that reason, I suggest using the branch CodeChallenge for evaluation purposes. On branch master I will continue to develop this project including new functions and other improvements.
