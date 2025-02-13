// // const axios = require('axios');
// import axios from 'axios'

// async function geocodeAddress(address) {
//     const apiKey = 'Pff1PmF0PtXXx2zwMLGWdUwMj7nLXWvvHVhhPCSM0hA';
//     const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         console.log(response.data['items']); // Handle the response data
//     } catch (error) {
//         console.error('Error geocoding address:', error);
//     }
// }

// geocodeAddress('1600 Amphitheatre Parkway, Mountain View, CA');

// import jsforce from "jsforce";
// const conn = new jsforce.Connection({
//     // you can change loginUrl to connect to sandbox or prerelease env.
//     // loginUrl : "https://test.salesforce.com"
//   });
//   // Log in with basic SOAP login (see documentation for other auth options)
//   conn.login(
//     process.env.USERNAME,
//     process.env.PASSWORD + process.env.SECURITY_TOKEN,
//     (err, res) => {
//       if (err) {
//         return console.error("Failed to log in to Salesforce: ", err);
//       }
//       console.log("Successfully logged in!");
//       // Run a SOQL query
//       conn.query("SELECT Id, Name FROM Account LIMIT 5", (err, result) => {
//         if (err) {
//           return console.error("Failed to run SOQL query: ", err);
//         }
//         // Display query results
//         const { records } = result;
//         console.log(`Fetched ${records.length} records:`);
//         records.forEach(record => {
//           console.log(`- ${record.Name} (${record.Id})`);
//         });
//       });
//     }
//   );

// let map1 = new Map();

// map1.set("first name", "sumit");
// map1.set("last name", "ghosh");
// map1.set("website", "geeksforgeeks")
//     .set("friend 1","gourav")
//     .set("friend 2","sourav");
// var a=BigInt("1111111111111111111111111111111111768769798098054111111111111111111111111111111111111111111")
// console.log(a)

// console.log(map1);
    
// console.log("map1 has website ? "+ (map1.has("website")?"Yes":"No"));

// console.log("map1 has friend 3 ? " + 
//                     (map1.has("friend 3")?"Yes":"No"));

// console.log("get value for key website "+
//                     map1.get("website"));

// console.log("get value for key friend 3 "+
//                     map1.get("friend 3"));
// console.log("delete element with key website " 
//                     + map1.delete("website"));
    
// console.log("map1 has website ? "+ 
//                     map1.has("website"));

// console.log("delete element with key website " +
//                     map1.delete("friend 3"));

// map1.clear();

// console.log(map1);


