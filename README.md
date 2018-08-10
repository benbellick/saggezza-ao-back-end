Instructions for Making Users Admins

Before beginning this process, you must have credentials to the database. The best person to get these from are probably Sean McQuay. Also, this process is assuming users go onto the website and enter their credentials into the create user page. 

Preparatory Steps:
1. Logon to the server (easiest with putty)
    a. With Putty, enter the IP (10.2.2.49 at the time of this writing)
    b. When you click open, you will be prompted with a bash window to enter your credentials
    c. Enter them successfully and you will be in the server
Type “psql” and press enter (You should see the prompt style change to “[your_name]=>”)
2. Type “\c aodb” and press enter (You should see the prompt style change to “aodb=>”)

To add a user (on AO website):
1. Have a user fill out the sign up page and then manually verify the user as instructed above.

To see all users and their respective statuses: 
1. Type “SELECT * FROM credentials;” and press Enter
When done, simply press “Q”

To mark a user as verified:
1. Figure out their email address, see above
2. Type “UPDATE credentials SET verified = true WHERE email = ‘[INSERT_USER_EMAIL]’;” and press enter (make sure to enter the email exactly as it appears in the database)
3. Check all users (as above) to ensure the user was successfully verified

To make a user and admin:
1. Figure out their email address, see above
2. Type “UPDATE credentials SET admin = true WHERE email = ‘[INSERT_USER_EMAIL]’;” and press enter (make sure to enter the email exactly as it appears in the database)
3. Check all users (as above) to ensure the user was successfully made an admin

To delete a user:
1. Figure out their email address, see above
2. Type “DELETE FROM credentials WHERE email = ‘[INSERT_USER_EMAIL]’;” and press enter (make sure to enter the email exactly as it appears in the database)
3. Check all users (as above) to ensure the user was successfully deleted
