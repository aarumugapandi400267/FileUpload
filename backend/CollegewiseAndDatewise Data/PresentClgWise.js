import { DB } from "../Database/DB.js"
const PresentClgWise=async (req, res) => {
    const date = req.params.date
    const toBeFind = req.params.college
    const hosteller = DB.collection("Present" + date)
    const dayscholar = DB.collection("Dayscholar_Present" + date)

    const DayscholarPresentCount = await dayscholar.find({ Institution: toBeFind }).toArray()
    const HostellerPresentCount = await hosteller.find({ Institution: toBeFind }).toArray()

    const TotalPresent = [...new Set([...DayscholarPresentCount, ...HostellerPresentCount])]
    res.json(TotalPresent)
}

export {PresentClgWise}