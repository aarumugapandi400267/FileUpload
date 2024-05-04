/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import moment from 'moment'
// import xlsx from 'xlsx';
import { MongoClient } from 'mongodb';
import cors from 'cors'
import mongoose from 'mongoose';
import { uploader } from './backend/uploader.js';
import { master } from './backend/master.js';
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
        ...(await DB.collection("Present20-02-2024").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Absent20-02-2024").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Dayscholar_Absent20-02-2024").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Dayscholar_Present20-02-2024").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Partially_Absent20-02-2024").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray()),
        ...(await DB.collection("Holiday20-02-2024").find({}, { projection: { Register_No: 1, Student_Name: 1, Gender: 1, Institution: 1, Department: 1, Year: 1, Course: 1 } }).toArray())
    ])
]
 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
 
app.get('/api/attendance/present/:date', async (req, res) => {
    const date=req.params.date
    const TotalStudentsPresent = [
        ...new Set([
            ...(await DB.collection("Present"+date).find({}).toArray()),
            ...(await DB.collection("Dayscholar_Present"+date).find({}).toArray())
        ])
    ]
    res.json(TotalStudentsPresent)
})

//For particular date
app.get('/api/attendance/absent/:date', async (req, res) => {
    const date=req.params.date
    const TotalStudentsAbsent = [
        ...new Set([
            ...(await DB.collection("Absent"+date).find({}).toArray()),
            ...(await DB.collection("Dayscholar_Absent"+date).find({}).toArray())
        ])
    ]
    res.json(TotalStudentsAbsent)
})

//For * date for absent
app.get('/api/attendance/absent', async (req, res) => {
    try {
        const collectionNames = await DB.listCollections().toArray();
        let totalAbsentStudents = [];
        for (let i = 0; i < collectionNames.length; i++) {
            const collName = collectionNames[i].name;
            if (collName.includes("Absent") || collName.includes("Holiday")) {
                let date = collName.replace("Absent", "").replace("Holiday","").replace("Dayscholar_","").replace("_","").replace("Partially","");
                const collectionData = await DB.collection(collName).find({}).toArray();
                const inputFormat = 'DD-MM-YYYY';
                const outputFormat = 'MM-DD-YYYY';
                collectionData.forEach(doc => {
                    doc.Date = moment(date,inputFormat).format(outputFormat);
                    if(!doc.status){
                        doc.status="Absent"
                    }
                    totalAbsentStudents.push(doc);
                });
            }
        }
        res.json(totalAbsentStudents);
    } catch (error) {
        console.error("Error retrieving absent students:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//For * date for present
app.get('/api/attendance/present', async (req, res) => {
    try {
        const collectionNames = await DB.listCollections().toArray();
        let totalAbsentStudents = [];
        for (let i = 0; i < collectionNames.length; i++) {
            const collName = collectionNames[i].name;
            if (collName.includes("Present") || collName.includes("Partially_Absent") || collName.includes("Dayscholar_Present") ){
                let date = collName.replace("Present", "").replace("Dayscholar_Present", "").replace("Dayscholar_","").replace("_","").replace("PartiallyAbsent","");
                const collectionData = await DB.collection(collName).find({}).toArray();
                const inputFormat = 'DD-MM-YYYY';
                const outputFormat = 'MM-DD-YYYY';
                collectionData.forEach(doc => {
                    doc.Date = moment(date,inputFormat).format(outputFormat);
                    if(!doc.status){
                        doc.status="Prsent"
                    }
                    totalAbsentStudents.push(doc);
                });
            }
        }
        res.json(totalAbsentStudents);
    } catch (error) {
        console.error("Error retrieving absent students:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/attendance/partiallyabsent/:date', async (req, res) => {
    const date=req.params.date
    const TotalStudentsPartiallyAbsent = [
        ...new Set([
            ...(await DB.collection("Partially_Absent"+date).find({}).toArray())
        ]) 
    ]
    res.json(TotalStudentsPartiallyAbsent)
})
app.get('/api/attendance/holiday-student/:date', async (req, res) => {
    const date=req.params.date
    const HolidayStudents = [
        ...new Set([
            ...(await DB.collection("Holiday"+date).find({}).toArray())
        ])
    ]
    res.json(HolidayStudents)
})

app.get('/masterdb',async(req,res)=>{
    const wholeData=await Student_ManagementDB.find({}).toArray()
    res.json(wholeData)
})
 
// app.get('/master', master)

app.post('/upload-excel', upload.single('fileUpload'),uploader );

app.get('/api/attendance/present/:college/:date', async (req, res) => {
    const date=req.params.date
    const toBeFind = req.params.college
    const hosteller = DB.collection("Present"+date)
    const dayscholar = DB.collection("Dayscholar_Present"+date)

    const DayscholarPresentCount = await dayscholar.find({ Institution: toBeFind }).toArray()
    const HostellerPresentCount = await hosteller.find({ Institution: toBeFind }).toArray()

    const TotalPresent = [...new Set([...DayscholarPresentCount, ...HostellerPresentCount])]
    res.json(TotalPresent)
})

app.get('/api/attendance/absent/:college/:date', async (req, res) => {
    const date=req.params.date
    const toBeFind = req.params.college
    const hosteller = DB.collection("Absent"+date)
    const dayscholar = DB.collection("Dayscholar_Absent"+date)

    const DayscholarPresentCount = await dayscholar.find({ Institution: toBeFind }).toArray()
    const HostellerPresentCount = await hosteller.find({ Institution: toBeFind }).toArray()

    const TotalPresent = [...new Set([...DayscholarPresentCount, ...HostellerPresentCount])]
    res.json(TotalPresent)
})
 
app.get('/api/attendance/partially_absent/:college/:date', async (req, res) => {
    const date=req.params.date
    const toBeFind = req.params.college
    const Partially_Absent = DB.collection("Partially_Absent"+date)
    const DayscholarPresentCount = await Partially_Absent.find({ Institution: toBeFind }).toArray()
    const TotalPresent = [...new Set([...DayscholarPresentCount])]
    res.json(TotalPresent)
})
app.get('/',async(req,res)=>{
    res.json(TotalStudents)
})

app.listen(PORT, () => {
    console.log("http://localhost:3002", PORT);
});

export {TotalStudents,DB,Student_ManagementDB,StudentSchemaModel}