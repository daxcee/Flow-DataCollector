# Flow Scraper

## Prerequisites

[Nodejs](https://nodejs.org)

[NPM](https://www.npmjs.com)

[MongoDB](https://www.mongodb.org)


Nodejs install via brew (OSX):

[http://brew.sh](http://brew.sh)

then, install nodejs package:

    brew install node
    
## Install dependencies

NPM is used as dependencies/package manager.

To install the needed modules for this Nodejs app, 
run the following command from the `root`of the project:

    sudo npm install

Note that these dependencies are not checked in on the repo 
and thus are only available on the local machine.

## Build and Run

### Environment variables

TBD

### Import JSON sample data

Startup mongo by running:

	   mongo
	   
Create a database, named `flow`:	   

	   use scraper


Sample data can be found in the [samples](https://github.com/srmds/FlowAPI/tree/master/samples) dir, import by running:

via the provided shell script, found in root:

    ./data_import.sh

or manually on each file:     

		mongoimport -d db_name -c collection_name --file filename.json --jsonArray
		
### Start server
			
Finally, from `root` of the project run:
 
     nodemon app.js 
     
Nodemon will monitor for any changes and automatically restart the server if needed. 
Open up a new browser tab and go to the follow to check if server is properly running:

[http://localhost:3000](http://localhost:3000)

## Mocha tests

For every API endpoint there are tests, see test dir.

To run the Mocha tests, from `root` run:

      npm test
            
## MIT License
Copyright 2015 srmds

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.