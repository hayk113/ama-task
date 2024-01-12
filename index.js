const fs = require('fs');
const { parseString } = require('xml2js');


//Parse CSV


function readCSV(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return fileContent;
    } catch (err) {
        console.error('Error reading the file:', err);
        return null;
    }
}

function csvParse(content) {
    const rows = content.split('\n');
    const headers = rows[0].split(',');

    const data = [];

    for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',');
        if (values.length === headers.length) {
            const obj = {};
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j].trim()] = values[j].trim();
            }
            data.push(obj);
        }
    }

    return data;
}


//Round numbers ti decimal places
function roundToDecimalPlaces(number, decimalPlaces) {
    const factor = 10 ** decimalPlaces;
    return Math.ceil(number * factor) / factor;
}

function parseCSV() {
    const filePath = 'records.csv';

    const csvContent = readCSV(filePath);

    if (csvContent) {
        const parsedData = csvParse(csvContent);
        //console.log(parsedData);
        // Process the parsed data as needed
        // Array of reference elemnts
        const arrOfRefernces = parsedData.map(el => el.Reference);

        //Checking if array has dublicate elements
        const hasDuplicates = (arr) => arr.length !== new Set(arr).size;
        // Find dublicate elemnts in array
        let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)

        //Log elements in if they exist
        if (hasDuplicates(arrOfRefernces) && findDuplicates(arrOfRefernces).length !== 0) {
            console.log("Record filed in CSV records! Dublicate records found!");
            console.log("Record reference(s) in CSV file: ", [...new Set(findDuplicates(arrOfRefernces))].toString())
        } else {
            console.log("Filed dublicate records not found in CSV records!");
        }


        // Assuming parsedData is the array of objects obtained from parsing the CSV
        for (const record of parsedData) {
            //sum of start balance and mutation
            let sum = parseFloat(record['Start Balance']) + parseFloat(record.Mutation);
            //Log records if balance is invalid
            if (roundToDecimalPlaces(sum, 2) !== parseFloat(record['End Balance'])) {
                console.log("Record filed in CSV records! The end balance is invalid");
                console.log('Reference:', record.Reference);
                console.log('Account Number:', record['Account Number']);
                console.log('Description:', record.Description);
                console.log('Start Balance:', parseFloat(record['Start Balance']));
                console.log('Mutation:', parseFloat(record.Mutation));
                console.log('End Balance:', parseFloat(record['End Balance']));
                console.log('!!!'); // Separator between records
            }

        }
    }
}

parseCSV();







console.log('End of CSV report!'); // Separator between records




/// Parse XML


//reading XML file
function readXML(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(`Error reading the file: ${err}`);
            } else {
                resolve(data);
            }
        });
    });
}

// Parsing XML file
async function parseXML() {
    const filePath = 'records.xml';

    try {
        const xmlContent = await readXML(filePath);

        parseString(xmlContent, { explicitArray: false }, (err, result) => {
            if (err) {
                console.error(`Error parsing XML: ${err}`);
            } else {
                const records = result.records.record;
                //creating empty array for reference values
                const arrOfRefernces = []
                for (const record of records) {
                    //push reference values to array
                    arrOfRefernces.push(record.$.reference)

                    let sum = parseFloat(record.startBalance) + parseFloat(record.mutation)

                    if (roundToDecimalPlaces(sum, 2) !== parseFloat(record.endBalance)) {
                        console.log("Record filed in XML records! The end balance is invalid");
                        console.log('Reference:', record.$.reference);
                        console.log('Account Number:', record.accountNumber);
                        console.log('Description:', record.description);
                        console.log('Start Balance:', parseFloat(record.startBalance));
                        console.log('Mutation:', parseFloat(record.mutation));
                        console.log('End Balance:', parseFloat(record.endBalance))
                        console.log('---'); // Separator between records
                    }

                }


                const hasDuplicates = (arr) => arr.length !== new Set(arr).size;
                let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)

                if (hasDuplicates(arrOfRefernces) && findDuplicates(arrOfRefernces).length !== 0) {
                    console.log("Record filed in XML records! Dublicate records found!");
                    console.log("Record reference: ", [...new Set(findDuplicates(arrOfRefernces))])
                } else {
                    console.log("Filed records not found in XML records!");
                }
            }

        });
    } catch (error) {
        console.error(error);
    }
}

parseXML();