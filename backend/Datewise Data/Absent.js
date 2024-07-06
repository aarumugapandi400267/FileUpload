import { DB } from "../Database/DB.js";

const Absent= async (req, res) => {
    const date = req.params.date
    const TotalStudentsAbsent = [
        ...new Set([
            ...(await DB.collection("Absent" + date).find({}).toArray()),
            ...(await DB.collection("Dayscholar_Absent" + date).find({}).toArray())
        ])
    ]
    res.json(TotalStudentsAbsent)
}

export {Absent}