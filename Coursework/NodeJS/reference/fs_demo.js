const fs = require('fs');
const path = require('path');

const testFolderPath = path.join(__dirname, 'test');
const testFilePath = path.join(testFolderPath, 'test.txt');

// Note that the order of the following is not guaranteed due to the functions being asynchronous, so the program could crash. 
// I could have use synchronous functions here as well.

// Try to access the test folder. If it does not exist, create it.
fs.access(testFolderPath, err1 => {
    if (err1 && err1.code == 'ENOENT') {
        // Create a folder asynchronously. The callback is called when the operation is completed. Possible error is given as argument
        fs.mkdir(testFolderPath, {}, err2 => {
            if (err2)
                throw err2;
            console.log('Folder created');
        });
    }
});

// Access a file and write to it. Creates the file if it does not already exist.
fs.writeFile(testFilePath, 'test text\n', err => {
    if (err)
        throw err;
    console.log("Wrote to file");
});

// Access a file and append to it.
fs.appendFile(testFilePath, 'more test text', err => {
    if (err)
        throw err;
    console.log("Appended to file");
});

// Read the file. Add the encoding to avoid reading "raw" bytes.
fs.readFile(testFilePath, 'utf-8', (err, content) => {
    if (err)
        throw err;
    console.log(`Read file. Got content:\n${content}`);
});

// Rename a file
fs.rename(testFilePath, path.join(testFolderPath, 'test_renamed.txt'), err => {
    if (err)
        throw err;
    console.log("Renamed file");
});