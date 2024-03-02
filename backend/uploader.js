import xlsx from 'xlsx';
import { DB, Student_ManagementDB } from '../server.js';

const uploader = async (req, res) => {
    try {
        const { collection } = req.body;
        const Collection = DB.collection(collection);
        const file = req.file
        const fileName = file.originalname
        const fileBuffer = file.buffer;
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let data = xlsx.utils.sheet_to_json(sheet, { raw: false });

        const regex = /^([^-]+)-(\d{2}-\d{2}-\d{4})-(\d{2}-\d{2}-[AP]M)\.xlsx$/;
        // const pattern = /^[a-zA-Z]\d{2,6}[a-zA-Z]{2,6}\d{3,5}(L)?$/

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
            // for (let i = 0; i < data.length; i++) {

            //     let rowData = data[i];

            //     let modifiedRowData = {};
            //     Object.keys(rowData).forEach(key => {
            //         const modifiedKey = key.replace(/\s+/g, '_');
            //         modifiedRowData[modifiedKey] = rowData[key];
            //     });

            //     const pattern = /^[a-zA-Z]\d{2,6}[a-zA-Z]{2,6}\d{3,5}(L)?$/

            //     if (!pattern.test(modifiedRowData['Register_No'])) {
            //         unknown.push(modifiedRowData['Register_No'])
            //         continue
            //     }
            //     if (modifiedRowData['Register_No']) {
            //         const foundStudent = await Student_ManagementDB.findOne({ Register_No: modifiedRowData['Register_No'] })
            //         if (!foundStudent){
            //             continue
            //         }
            //         modifiedRowData['Year']=foundStudent['Year']
            //     }
            //     if (modifiedRowData['S_No']) {
            //         delete modifiedRowData['S_No']
            //     }
            //     delete modifiedRowData["Fee_Status"];
            //     if ((!await Collection.findOne(modifiedRowData) && await Student_ManagementDB.findOne({ Register_No: modifiedRowData["Register_No"] }))) {
            //         await Collection.insertOne(modifiedRowData);
            //     } else { 
            //         count += 1;
            //     }
            // }
            // console.log("Duplicates and Outliers:", count);
            // res.status(200).json({ status: "Ok" });
            // console.log(unknown)
            let count = 0;
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
                    }else{

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