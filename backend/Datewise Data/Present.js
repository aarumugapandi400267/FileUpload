import { DB } from "../Database/DB.js"

const Present=async (req, res) => {
    const date = req.params.date
    const TotalStudentsPresent = [
        ...new Set([
            ...(await DB.collection("Present" + date).find({}).toArray()),
            ...(await DB.collection("Dayscholar_Present" + date).find({}).toArray())
        ])
    ]
    res.json(TotalStudentsPresent)
}

export {Present}