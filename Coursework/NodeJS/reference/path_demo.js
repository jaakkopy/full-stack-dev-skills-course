const path = require('path');

// the full path to this file
console.log(__filename);
// just the current filename
console.log(path.basename(__filename));
// the directory name
console.log(path.dirname(__filename));
// the file extension
console.log(path.extname(__filename));
// create a JS object from the path, which contains root, dir, base, ext, name
console.log(path.parse(__filename));
// join the arguments together to a file path. Useful for shareability (different Windows paths, Linux paths)
console.log(path.join(__dirname, 'test', 'hello.html'));