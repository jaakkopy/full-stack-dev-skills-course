const url = require('url');

const test_url = new URL('http://some_website.com:5000/index.html?message=hello&place=world');

// serialized url i.e just the url text
console.log(test_url.href);
console.log(test_url.toString());
// get the host i.e the root domain
console.log(test_url.host);
// Just the hostname. No port
console.log(test_url.hostname);
// path on the host.
console.log(test_url.pathname);
// the search parameters in a string
console.log(test_url.search);
// the search parameters in an object
console.log(test_url.searchParams);
// add a new parameter to the object
test_url.searchParams.append('newParamKey', 'newParamValue');
console.log(test_url.searchParams);
// loop the parameter key value pairs
test_url.searchParams.forEach((v, k) => console.log(k, v));
