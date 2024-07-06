/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'

import { Student_ManagementDB } from './backend/Database/DB.js';
import {upload} from './backend/Upload File/UploadOptions.js'
import { uploader } from './backend/uploader.js';
import {AbsentData} from './backend/AbsentData.js'
import { PresentData } from './backend/PresentData.js';
import { Present } from './backend/Datewise Data/Present.js';
import { Absent } from './backend/Datewise Data/Absent.js';
import { PartiallyAbsent } from './backend/Datewise Data/PartiallyAbsent.js';
import { Holiday } from './backend/Datewise Data/HolidayData.js';
import { PresentClgWise } from './backend/CollegewiseAndDatewise Data/PresentClgWise.js';
import { AbsentClgWise } from './backend/CollegewiseAndDatewise Data/AbsentClgWise.js';
import { PartiallyAbsentClgWise } from './backend/CollegewiseAndDatewise Data/Partially Absent.js';
// import { master } from './backend/master.js';

const app = express();
const PORT = 3002;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

//Overall Data
app.get('/api/attendance/absent',AbsentData );
app.get('/api/attendance/present', PresentData);

//Date wise
app.get('/api/attendance/present/:date', Present)
app.get('/api/attendance/absent/:date',Absent)
app.get('/api/attendance/partiallyabsent/:date', PartiallyAbsent)
app.get('/api/attendance/holiday-student/:date',Holiday)

//Date wise + College wise
app.get('/api/attendance/present/:college/:date', PresentClgWise)
app.get('/api/attendance/absent/:college/:date', AbsentClgWise)
app.get('/api/attendance/partially_absent/:college/:date', PartiallyAbsentClgWise)

app.get('/masterdb', async (req, res) => {
    const wholeData = await Student_ManagementDB.find({}).toArray()
    res.json(wholeData)
})

app.post('/upload-excel', upload.single('fileUpload'), uploader);

app.listen(PORT, () => {
    console.log("http://localhost:3002", PORT);
});

// app.get('/master', master)