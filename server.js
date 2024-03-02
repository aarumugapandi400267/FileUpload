/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
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
 
app.get('/master', master)

app.post('/upload-excel', upload.single('fileUpload'),uploader );

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



app.listen(PORT, () => {
    console.log("http://localhost:3002", PORT);
});


export {TotalStudents,DB,Student_ManagementDB,StudentSchemaModel}