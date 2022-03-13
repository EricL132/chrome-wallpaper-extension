# Chrome Wallpaper Extension
A Google Chrome Extension that changes wallpaper on every new tab. Extension saves a list of images to localstorage and grabs one at random whenever new tab is opened.  
Upload images by url is also supported but these images will not be saved to google cloud.  
Images are saved to google cloud storage.  

# How to Install
To use locally run the following command in terminal
```
git clone https://github.com/EricL132/chrome-wallpaper-extension.git
```
Navigate to ```chrome://extensions/``` in Google Chrome  
Load extension by clicking on ```Load unpacked``` located on top left of page and opening the cloned folder

# Required Integration
This extension requires a backend server, code for server is in the repository below.
https://github.com/EricL132/chrome-wallpaper-server  

Extension saves images to google cloud storage server, as a result requires a backend server to receive images and upload images to google cloudd storage

