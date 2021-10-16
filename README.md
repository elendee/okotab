# okotab
new tab todo list chrome extension

# install
open Chrome extensions, make sure Dev mode is on, and Load Unpacked
choose the folder, wherever you put it, and enable the extension

## server things:

#### load 2 php scripts to server
- copy `boards_get.php` and `boards_set.php` from the extension folder to a folder of your choosing on your server

#### env.php file:
- make a file `env.php` in the same php folder.  Sample `env.php`:
```
<?php
$TODO_URI = '../../../TODO-BOARDS.txt';
$TODO_PW = 'my-uber-password';
```
- ( Important: Create the `TODO-BOARDS.txt` file on your server - probably in a private directory - this is your todo lists. )

## client / localhost things

#### allow CORS ( requests from outside the server )
- make sure that folder or a previous one has an `.htaccess` file with the following: `Header set Access-Control-Allow-Origin "*"`

#### env.js file:
- make an `env.js` file in the extension folder, with the following variables to connect to your server:
sample `env.js`:
```
export default {
	SCRIPT_ROOT_URL: 'https://[mywebsite.com]/[folder-you-put-scripts-in]',
	PW: [ password matching your choice in php scripts ],
}
```
