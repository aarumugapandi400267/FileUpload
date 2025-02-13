import { DB } from "../Database/DB.js"

const PartiallyAbsentClgWise=async (req, res) => {
    const date = req.params.date
    const toBeFind = req.params.college
    const Partially_Absent = DB.collection("Partially_Absent" + date)
    const DayscholarPresentCount = await Partially_Absent.find({ Institution: toBeFind }).toArray()
    const TotalPresent = [...new Set([...DayscholarPresentCount])]
    res.json(TotalPresent)
}

export {PartiallyAbsentClgWise}