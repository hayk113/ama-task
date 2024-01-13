# Bank Customer Statement Processor

NodeJS is chosen to complete the task. This technology is most convenient for me to process CSV and XML files because there are convenient tools for working CSV and XML files with built-in tools and external libraries.
At the first step before validation, CSV and XML files are parsed. For CSV I choose the parsing method without an external library approach and for XML I choose xml2js library.
After parsing the data is processed to validate according to mentioned in the task conditions. Validation results as a report are available in the console.

# Installation

$ npm install

# Running the app

**development**<br>
$ npm run serve

**prodaction**<br>
$ npm run start
