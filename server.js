/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import xlsx from 'xlsx';
import { MongoClient } from 'mongodb';
import cors from 'cors'
import mongoose from 'mongoose';


const app = express();
const PORT = 3002;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Client = new MongoClient('mongodb://0.0.0.0/');
const DB = Client.db("Biometric_Maintainance");
const Student_ManagementDB = Client.db("Student_Management").collection("information")
const Schema = mongoose.Schema

const StudentSchema = new Schema({
    Institution: String,
    Course: String,
    Department: String,
    Year: Number,
    Register_No: String,
    Student_Name: String,
    Gender: String,
})
const StudentSchemaModel = mongoose.model("Information", StudentSchema)

const TotalStudents = [
    ...new Set([
        ...(await DB.collection("Present").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Absent").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Dayscholar_Absent").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Dayscholar_Present").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Partially_Absent").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Holiday").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray())
    ])
]

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.get('/api/attendance/present', async (req, res) => {
    mongoose.connect("mongodb://0.0.0.0/Student_Management")
    let pattern1 = /^[a-zA-Z]\d{2,6}[a-zA-Z]{2,6}\d{3,5}$/;

})

app.get('/master', async (req, res) => {
    mongoose.connect("mongodb://0.0.0.0/Student_Management")
    const pattern=/^[a-zA-Z]\d{2,6}[a-zA-Z]{2,6}\d{3,5}(L)?$/
    const patternForY = /^([a-zA-Z]+)(\d{2,6})([a-zA-Z]{2,6})(\d{3,5})(L)?$/;
    let FilteredTotalStudents = TotalStudents.filter(row => pattern.test(row.Register_No))
    FilteredTotalStudents.forEach(studentInfo => {
        const match=studentInfo.Register_No.match(patternForY)
        if(match){
            switch (parseInt(match[2])){
                case 20:
                    studentInfo.Year=4
                    break
                case 21:
                    studentInfo.Year=3
                    break
                case 22:
                    studentInfo.Year=2
                    break
                case 23:
                    studentInfo.Year=1 
                    break
            }
        }
    })
    await StudentSchemaModel.insertMany(FilteredTotalStudents)
    res.json(FilteredTotalStudents)
})

app.post('/upload-excel', upload.single('fileUpload'), async (req, res) => {
    try {
        const { collection } = req.body;
        const Collection = DB.collection(String(collection));
        const file = req.file
        const fileName = file.originalname
        const fileBuffer = file.buffer;
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let data = xlsx.utils.sheet_to_json(sheet, { raw: false });

        const regex = /^([^-]+)-(\d{2}-\d{2}-\d{4})-(\d{2}-\d{2}-[AP]M)\.xlsx$/;

        // Execute the regular expression on the filename
        const matches = fileName.match(regex);
        var name
        if (matches && matches.length === 4) {
            name = matches[1];
            const date = matches[2];
            const time = matches[3];
        } else {
            return res.json({ message: "Filename doesn't match the expected pattern." });
        }
        if (
            collection == "Absent" && name == "absent" ||
            collection == "Present" && name == "present" ||
            collection == "Holiday" && name == "holiday_students" ||
            collection == "Partially_Absent" && name == "partially_absent" ||
            collection == "Dayscholar_Absent" && name == "dayscholar_absent" ||
            collection == "Dayscholar_Present" && name == "dayscholar_present"
        ) {
            let count = 0;
            let unknown = []
            for (let i = 0; i < data.length; i++) {

                let rowData = data[i];

                let modifiedRowData = {};
                Object.keys(rowData).forEach(key => {
                    const modifiedKey = key.replace(/\s+/g, '_');
                    modifiedRowData[modifiedKey] = rowData[key];
                });
                if (!Student_ManagementDB.find(modifiedRowData['Register_No'])) {
                    return unknown.push(modifiedRowData)
                }
                if (modifiedRowData['Year']) {
                    switch (modifiedRowData['Year']) {
                        case "I Year":
                            modifiedRowData['Year'] = 1;
                            break;
                        case "II Year":
                            modifiedRowData['Year'] = 2;
                            break;
                        case "III Year":
                            modifiedRowData['Year'] = 3;
                            break;
                        case "IV Year":
                            modifiedRowData['Year'] = 4;
                            break;
                    }
                }
                if (modifiedRowData['S_No']) {
                    modifiedRowData['S_No'] = parseInt(modifiedRowData['S_No']);
                }
                delete modifiedRowData["Fee_Status"];
                if (!await Collection.findOne(modifiedRowData)) {
                    await Collection.insertOne(modifiedRowData);
                } else {
                    count += 1;
                }
            }
            console.log("Duplicates:", count);
            res.status(200).json({ status: "Ok" });
        } else {
            return res.json({ message: "Filename doesn't match the expected pattern." })
        }

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/attendance/present/:college', async (req, res) => {
    const toBeFind = req.params.college
    const hosteller = DB.collection("Present")
    const dayscholar = DB.collection("Dayscholar_Present")

    const DayscholarPresentCount = await dayscholar.find({ Institution: toBeFind }).toArray()
    const HostellerPresentCount = await hosteller.find({ Institution: toBeFind }).toArray()

    const TotalPresent = [...new Set([...DayscholarPresentCount, ...HostellerPresentCount])]
    res.json(TotalPresent)
})

app.get('/api/attendance/absent/:college', async (req, res) => {
    const toBeFind = req.params.college
    const hosteller = DB.collection("Absent")
    const dayscholar = DB.collection("Dayscholar_Absent")

    const DayscholarPresentCount = await dayscholar.find({ Institution: toBeFind }).toArray()
    const HostellerPresentCount = await hosteller.find({ Institution: toBeFind }).toArray()

    const TotalPresent = [...new Set([...DayscholarPresentCount, ...HostellerPresentCount])]
    res.json(TotalPresent)
})

app.get('/api/attendance/partially_absent/:college', async (req, res) => {
    const toBeFind = req.params.college
    const Partially_Absent = DB.collection("Partially_Absent")
    const DayscholarPresentCount = await Partially_Absent.find({ Institution: toBeFind }).toArray()
    const TotalPresent = [...new Set([...DayscholarPresentCount])]
    res.json(TotalPresent)
})


app.get('/', (req, res) => {
    res.json(TotalStudents)
})

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
