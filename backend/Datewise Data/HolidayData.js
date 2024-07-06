import { DB } from "../Database/DB.js";

const Holiday= async (req, res) => {
    const date = req.params.date
    const HolidayStudents = [
        ...new Set([
            ...(await DB.collection("Holiday" + date).find({}).toArray())
        ])
    ]
    res.json(HolidayStudents)
}

export {Holiday}