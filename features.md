Features of this experiment:

- Login with a personal account
- Create personal boards
- Create lists as container for cards
- Create tasks as cards with a title and a description
- Rearrange cards inside of lists and move them between lists
- Share access to a board with other users
- Work with multiple users on the same board in realtime

Maybe:
- A text chat between all users on the same board
- A changelog of changes made by users to the board

Components:

- NodeJS-Server
- JSON Database
- Client-App




Architecture:

+----------------+  
| Node JS Server |   
+----------------+  
        ^  
        |  
        v  
+----------------+  
| Client-App     |  
+----------------+   



Board Persistance:

Every new board gets a unique ID of 5 characters (0-9 and a-z):
E.g. h42uz

The NodeJS-Server creates a new board id if no id will be provided and persists the new board in a separate JSON-file.
