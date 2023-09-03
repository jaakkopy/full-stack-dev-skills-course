const os = require('os');

// platform
console.log(os.platform());
// cpu architecture
console.log(os.arch());
// cpu info
console.log(os.cpus());
// amount of free memory
console.log(os.freemem());
// amount of total memory
console.log(os.totalmem());
// home dir
console.log(os.homedir());
// system uptime in seconds
console.log(os.uptime());
