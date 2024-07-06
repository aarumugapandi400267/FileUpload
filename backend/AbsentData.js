import { DB } from "./Database/DB.js";
import moment from 'moment'

const AbsentData=async (req, res) => {
    try {
        const collectionNames = await DB.listCollections().toArray();
        let totalAbsentStudents = [];
        
        for (let i = 0; i < collectionNames.length; i++) {
            const collName = collectionNames[i].name;
            if (collName.includes("Absent") && !collName.includes("Partially_") || collName.includes("Holiday")) {
                let date = collName.replace("Absent", "").replace("Holiday", "").replace("Dayscholar_", "").replace("_", "").replace("Partially", "");
                const collectionData = await DB.collection(collName).find({}).toArray();
                collectionData.forEach(doc => {
                    // doc.Date = moment(date, 'DD-MM-YYYY').format('MM-DD-YYYY');
                    doc.Date = date;
                    if (!doc.status) {
                        doc.status = "Absent"
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
}

export{AbsentData}