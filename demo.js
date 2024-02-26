const filename = "absent-20-02-2024-09-51-AM.xlsx";

// Define a regular expression pattern to match the name and the date with time
const regex = /^([^-]+)-(\d{2}-\d{2}-\d{4})-(\d{2}-\d{2}-[AP]M)\.xlsx$/;

// Execute the regular expression on the filename
const matches = filename.match(regex);

if (matches && matches.length === 4) {
    const name = matches[1];
    const date = matches[2];
    const time = matches[3];

    console.log("Name:", name);
    console.log("Date:", date);
    console.log("Time:", time);
} else {
    console.log("Filename doesn't match the expected pattern.");
}
