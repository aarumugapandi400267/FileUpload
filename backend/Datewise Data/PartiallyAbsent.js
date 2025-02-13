import { DB } from "../Database/DB.js";

const PartiallyAbsent=async (req, res) => {
    const date = req.params.date
    const TotalStudentsPartiallyAbsent = [
        ...new Set([
            ...(await DB.collection("Partially_Absent" + date).find({}).toArray())
        ])
    ]
    res.json(TotalStudentsPartiallyAbsent)
}

export {PartiallyAbsent}