import mongoose from 'mongoose';
import {  DB, StudentSchemaModel } from '../server.js';

const TotalStudents = [
    ...new Set([
        ...(await DB.collection("Present20-02-2024").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Absent20-02-2024").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Dayscholar_Absent20-02-2024").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Dayscholar_Present20-02-2024").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Partially_Absent20-02-2024").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Holiday20-02-2024").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray())
    ])
]

const master = async (req, res) => {
    mongoose.connect("mongodb://0.0.0.0/Student_Management")
    // const pattern = /^[a-zA-Z](20|21|22|23)[a-zA-Z]{3,6}\d{3,5}(L)?$/
    const patternForY = /^([a-zA-Z]+)(20|21|22|23)([a-zA-Z]{2,6})(\d{3,5})(L)?$/;
    let FilteredTotalStudents = TotalStudents.filter(row => patternForY.test(row.Register_No))
    let fake = TotalStudents.filter(row => !patternForY.test(row.Register_No))
    FilteredTotalStudents.forEach(studentInfo => {
        const match = studentInfo.Register_No.match(patternForY)
        if (match) {
            switch (match[1]) {
                case "E":
                    studentInfo.Institution = "Engineering"; break

                case "P":
                    studentInfo.Institution = "Pharmacy"; break

                case "A":
                    studentInfo.Institution = "Allied Health and Science"; break

                case "N":
                    studentInfo.Institution = "Nursing"; break
            }
            switch (parseInt(match[2])) {
                case 20:
                    studentInfo.Year = 4;
                    break
                case 21:
                    studentInfo.Year = 3;
                    break
                case 22:
                    studentInfo.Year = 2;
                    break
                case 23:
                    studentInfo.Year = 1;
                    break
            }
            switch (match[3]) {
                case "DP":
                    studentInfo.Department = "D-Pharm"; break
                case "BP":
                    studentInfo.Department = "B-Pharm"; break
                case "HI":
                    studentInfo.Department = "Health Inspector"; break
                case "PD":
                    studentInfo.Department = "Pharm D"; break
                case "NS":
                    studentInfo.Department = "Nursing"; break
                case "CPPCT":
                    studentInfo.Department = "CPPCT"; break
                case "ACT":
                    studentInfo.Department = "CT"; break
                case "SCT":
                    studentInfo.Department = "CT"; break
                case "MLT":
                    studentInfo.Department = "MLT"; break
                case "SOPTO":
                    studentInfo.Department = "OPTO"; break
                case "AOT":
                    studentInfo.Department = "OTAT"; break
                case "SOT":
                    studentInfo.Department = "OTAT"; break
                case "ARIT":
                    studentInfo.Department = "RIT"; break
                case "SRIT":
                    studentInfo.Department = "RIT"; break
                case "SCPPCT":
                    studentInfo.Department = "CPPCT"; break
                case "CY":
                    studentInfo.Department = "CYBER SECURITY"; break
                case "AG":
                    studentInfo.Department = "Agri"; break
                case "MECS":
                    studentInfo.Department = "MECS"; break
                case "ME":
                    studentInfo.Department = "Mech"; break
                case "MC":
                    studentInfo.Department = "Mech"; break
                case "BE":
                    studentInfo.Department = "Bio-Medical"; break
                case "CS":
                    studentInfo.Department = "CSE"; break
                case "EC":
                    studentInfo.Department = "ECE"; break
                default:
                    studentInfo.Department = match[3]


            }
            if (match[1] == "P" && match[5] == "L") {
                // console.log(match[1], match[5], match[2], studentInfo)
                switch (match[2]) {
                    case 20:
                        studentInfo.Year = 4; break
                    case 21:
                        studentInfo.Year = 3; break
                    case 22:
                        studentInfo.Year = 2; break
                    case 23:
                        studentInfo.Year = 1;
                }
            }
            if (match[1] == "E" && match[5] == "L") {

                switch (parseInt(match[2])) {
                    case 20:
                        studentInfo.Year = 5; break
                    case 21:
                        studentInfo.Year = 4; break
                    case 22:
                        studentInfo.Year = 3; break
                    case 23:
                        studentInfo.Year = 2; break
                }
            }
        }
        if (studentInfo.Year == 5) {
            const indexToRemove = FilteredTotalStudents.indexOf(studentInfo);
            FilteredTotalStudents.splice(indexToRemove, 1);
        }
    })
    await StudentSchemaModel.insertMany(FilteredTotalStudents)
    res.json(FilteredTotalStudents)
}

export { master }