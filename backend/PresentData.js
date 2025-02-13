import { DB } from "./Database/DB.js";
import moment from 'moment'

const PresentData=async (req, res) => {
    try {
        const collectionNames = await DB.listCollections().toArray();
        let totalAbsentStudents = [];
        for (let i = 0; i < collectionNames.length; i++) {
            const collName = collectionNames[i].name;
            if (collName.includes("Present") || collName.includes("Partially_Absent") || collName.includes("Dayscholar_Present")) {
                let date = collName.replace("Present", "").replace("Dayscholar_Present", "").replace("Dayscholar_", "").replace("_", "").replace("PartiallyAbsent", "");
                const collectionData = await DB.collection(collName).find({}).toArray();
                collectionData.forEach(doc => {
                    // doc.Date = moment(date, 'DD-MM-YYYY').format('MM-DD-YYYY');
                    doc.Date = date;
                    doc.status = "Present"
                    totalAbsentStudents.push(doc);
                });
            }
        }
        res.json(totalAbsentStudents);
    } catch (error) {
        console.error("Error retrieving absent students:", error);
        res.status(500).json({ error: "Internal Server Error"}); 
    }
}

export {PresentData}