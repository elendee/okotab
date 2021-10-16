# okotab
new tab todo list chrome extension

# how to install
open Chrome extensions, make sure Dev mode is on, and Load Unpacked
choose the folder, wherever you put it, and enable the extension

## configuration
- make an "env.js" file in the root of the folder, with the following variables to connect to your server:
sample env.js:
```
export default {
	SCRIPT_ROOT_URL: 'https://[mywebsite.com]/[some-folder]',
	PW: [ password matching your choice in php scripts ],
}

```