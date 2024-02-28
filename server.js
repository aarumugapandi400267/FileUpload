import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import xlsx from 'xlsx';
import { MongoClient } from 'mongodb';
import cors from 'cors'

const app = express();
const PORT = 3002;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Client = new MongoClient('mongodb://0.0.0.0/');
const DB = Client.db("Biometric_Maintainance");

const TotalStudents = [
    ...new Set([
        ...(await DB.collection("Present").find({}).toArray()),
        ...(await DB.collection("Absent").find({}).toArray()),
        ...(await DB.collection("Dayscholar_Absent").find({}).toArray()),
        ...(await DB.collection("Dayscholar_Present").find({}).toArray()),
        ...(await DB.collection("Partially_Absent").find({}).toArray()),
        ...(await DB.collection("Holiday").find({}).toArray())
    ])
]

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.post('/upload-excel', upload.single('fileUpload'), async (req, res) => {
    try {
        const { collection } = req.body;
        const Collection = DB.collection(String(collection));
        const file = req.file
        const fileBuffer = file.buffer;
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let data = xlsx.utils.sheet_to_json(sheet, { raw: false });

        let count = 0;
        for (let i = 0; i < data.length; i++) {

            let rowData = data[i];

            let modifiedRowData = {};
            Object.keys(rowData).forEach(key => {
                const modifiedKey = key.replace(/\s+/g, '_');
                modifiedRowData[modifiedKey] = rowData[key];
            });
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
    res.json(TotalStudents.length)
})




app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
