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

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.post('/upload-excel', upload.single('fileUpload'), async (req, res) => {
    try {
        const { collection } = req.body;
        const Collection = DB.collection(String(collection));
        const file = req.file
        // const originalFileName = file.originalname
        const fileBuffer = file.buffer;
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let data = xlsx.utils.sheet_to_json(sheet, { raw: false });

        let count = 0;
        for (let i = 0; i < data.length; i++) {
            if(data[i].S_No){
                data[i].S_No = parseInt(data[i].S_No);
            }
            if (!await Collection.findOne(data[i])) {
                if(data[i].Year){
                    switch(data[i].Year){
                        case "I Year":
                            data[i].Year=1
                            break
                        case "II Year":
                            data[i].Year=2
                            break
                        case "III Year":
                            data[i].Year=3
                            break
                        case "IV Year":
                            data[i].Year=4
                            break
                    }
                }
                await Collection.insertOne(data[i]);
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

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
