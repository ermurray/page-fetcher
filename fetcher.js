const request = require('request');
const fs = require('fs');
const readline = require('readline');
const { ENOENT } = require('constants');
const http = process.argv[2];
const filename = process.argv[3];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if (http === undefined || filename === undefined) {
  console.log('please list http and file destination',);
  process.exit();
}
request(http, (error, response, body) => {
  console.log(`Requested: ${http}`);
  console.log('error:', error);
  console.log('statusCode:', response && response.statusCode);
  fs.stat(filename, (err) =>{
    if (err === ENOENT) {
      fs.writeFile(filename, body, (err) => {
        if (err) throw err;
        console.log(`the file has been downloaded and saved ${body.length} bytes to ${filename}`);
      });
    } else {
      rl.question('do you want to overwrite existing file Y or N ', (letter) => {
        if (letter === 'y') {
          fs.writeFile(filename, body, (err) => {
            if (err) throw err;
            console.log(`the file has been downloaded and saved ${body.length} to ${filename}`);
          });
        } else {
          console.log('rerun with new filename');
        }
        
        rl.close();
      });
    }
  });
});
