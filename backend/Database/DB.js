import { MongoClient } from 'mongodb';

import mongoose from 'mongoose';

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

const Client = new MongoClient('mongodb://0.0.0.0/');
const DB = Client.db("Biometric_Maintainance");
const Student_ManagementDB = Client.db("Student_Management").collection("information")

export {DB,StudentSchema,StudentSchemaModel,Student_ManagementDB}