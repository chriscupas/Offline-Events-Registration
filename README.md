# Project Title

Offline Event Registration

## Getting Started

This is an Offline Event Registration Built sometime in late 2015. Using Node JS and Angular JS. This will sync the offline data to the live one. 
The live one for this is made with Wordpress and wp plugin [events manager](https://wordpress.org/plugins/events-manager/) and few customization.

## Screenshots
![Dashboard](/1.JPG?raw=true "Dashboard")
![Registration Page](/2.JPG?raw=true "Registration Page")
![Attendance Page, barcode ready](/3.JPG?raw=true "Attendance Page, barcode ready")
![Registration lists](/4.JPG?raw=true "Registration lists")
![Settings page](/5.JPG?raw=true "Settings page")

### Prerequisites

Install Node JS

Debian (Ubuntu/ Mint)
```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

Windows - Using your favorite bash client cygwin or gitbash
```
git clone git://github.com/ry/node.git
cd node
./configure
make
sudo make install
```
or follow this [Node JS Installation](http://blog.teamtreehouse.com/install-node-js-npm-windows)

An LDAP ready machine
and Barcode scanner if you have but is not recommended since we can just input it to the text box

### Installing

Go to {DOCUMENT_PATH}/resources/app

Install node packages

```
npm install
```

Update LDAP configs - So that we can check those user that
```
{DOCUMENT_PATH}/resources/app/pages/config.json
{DOCUMENT_PATH}/resources/app/pages/config_prod.json
```

## Running the tests

* Run chriscupas.exe
* The registratin needs the Event ID
* On registration if you input the ID number it will look through the LDAP config and try to connect then it will populate the (Name,Dep Number, Email). Given if you choose Category as Staff.
* The In-Out. The scanning of barcode, assuming you have a barcode given to you via registration on the live site. This will be via email.
	It will record the in-out of the user
* Settings - is capable to sync the registration DB and attendance DB. Just input the correct domain and API. The live site should have the fields for this to accept handshake from offline to online.


## Deployment

Just make sure your online domain has the fields so that we can sync our offline data to live one.
If you want to create a standalone version use [Inno Setup](http://www.jrsoftware.org/isinfo.php)

## Built With

* [NodeJS](https://nodejs.org/en/)
* [AngularJS](https://angularjs.org/)
* [Electron](https://electron.atom.io/)

## Contributing

Please read [CONTRIBUTING.md](https://github.com/chriscupas/Offline-Events-Registration/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.


## Authors

* **Christopher Cupas** - *From scratch to finish*


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* To the almighty
* Inspiration
* etc
