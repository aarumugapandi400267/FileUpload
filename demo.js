// Define the pattern
const pattern = /^([a-zA-Z]+)(\d{2,6})([a-zA-Z]{2,6})(\d{3,5})(L)?$/;

// Example data
const data = [
    "ABC123EFG4567L",
    "XYZ987PQR3210",
    "MNO345STU6789L",
    "PQR12LMN3R456L"
];

// Iterate through the data
data.forEach(item => {
    const match = item.match(pattern);
    if (match) {
        const collegeName = match[1];
        const batch = match[2];
        const departmentName = match[3];
        const rollNumber = match[4];
        const lateralEntry = !!match[5];

        console.log("College Name:", collegeName);
        console.log("Batch:", batch);
        console.log("Department Name:", departmentName);
        console.log("Roll Number:", rollNumber);
        console.log(lateralEntry ? "Lateral Entry Student" : "Regular Entry Student");
        console.log();
    } else {
        console.log("No match found for:", item);
    }
});
