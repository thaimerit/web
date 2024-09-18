import { Chip } from "@mui/material";
import moment from "moment";

export default function LiveTable({ data }) {
    let startDate = moment(data.startDateTime).locale("th").add(543, "year").format("DD MMM YYYY");
    let endDate = moment(data.endDateTime).locale("th").add(543, "year").format("DD MMM YYYY");

    return <div>
        <div className="pb-2">วันที่ {startDate} - {endDate}</div>
        <table className="border-collapse border border-slate-400 sc-table w-full">
            <thead>
                <tr >
                    <th className="border border-slate-300 px-4 py-2 day-column text-center" style={{ width: "200px" }}>วัน</th>
                    <th className="border border-slate-300 px-4 py-2">รายการ Live</th>
                </tr>
            </thead>
            <tbody>
                {data.dayOfWeeks.map((dayOfWeek, dayOfWeekKey) => <tr key={dayOfWeek.slug}>
                    <td className="border border-slate-300 px-4 py-2 day-column text-center">{dayOfWeek.name}</td>
                    <td className="column border border-slate-300 px-4 py-2">
                        <Chip
                            label={moment(data.startDateTime).format("HH:mm") + " - " + moment(data.endDateTime).format("HH:mm")}
                            variant="outlined"
                            clickable
                        />
                    </td>
                </tr>)}
            </tbody>
        </table>
    </div>
}