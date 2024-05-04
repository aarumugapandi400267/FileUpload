import xlsx from 'xlsx';
import { DB, Student_ManagementDB } from '../server.js';
var date

const uploader = async (req, res) => {
    try {
        const { collection } = req.body;
        const file = req.file
        const fileName = file.originalname
        const fileBuffer = file.buffer;
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let data = xlsx.utils.sheet_to_json(sheet, { raw: false });

        const regex = /^([^-]+)-(\d{2}-\d{2}-\d{4})-(\d{2}-\d{2}-[AP]M)\.xlsx$/;
        const matches = fileName.match(regex);
        var name
        if (matches && matches.length === 4) {
            name = matches[1];
            date = matches[2];
            // const time = matches[3];
        } else {
            return res.json({ message: "Filename doesn't match the expected pattern." });
        }
        const Collection = DB.collection(collection+date);
        if (
            collection == "Absent" && name == "absent" ||
            collection == "Present" && name == "present" ||
            collection == "Holiday" && name == "holiday_students" ||
            collection == "Partially_Absent" && name == "Partially_Absent" ||
            collection == "Dayscholar_Absent" && name == "dayscholar_absent" ||
            collection == "Dayscholar_Present" && name == "dayscholar_present"
        ) {
            let unknown = []
            data.forEach(async rowData => {
                let modifiedRowData = {};
                Object.keys(rowData).forEach(key => {
                    const modifiedKey = key.replace(/\s+/g, '_');
                    modifiedRowData[modifiedKey] = rowData[key];
                });
                const foundStudent = await Student_ManagementDB.findOne({ Register_No: modifiedRowData['Register_No'] })
                if (foundStudent) {
                    modifiedRowData['Year'] = foundStudent['Year']
                    modifiedRowData['Institution'] = foundStudent['Institution']
                    modifiedRowData['Course'] = foundStudent['Course']
                    modifiedRowData['Department'] = foundStudent['Department']
                    modifiedRowData['Gender'] = foundStudent['Gender']
                    delete modifiedRowData['S_No']
                    const isalreadyUploaded=await Collection.findOne({Register_No:modifiedRowData['Register_No']})
                    // console.log(isalreadyUploaded);
                    if (!isalreadyUploaded) {
                        await Collection.insertOne(modifiedRowData)
                        // console.log("Ok");
                    }
                } else {
                    unknown.push(rowData)
                } 
            })
            // console.log(unknown);
            return res.json({ status: "Ok" })
        } else {
            return res.json({ message: "Filename doesn't match the expected pattern." })
        }

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Internal Server Error');
    }
}

export { uploader }