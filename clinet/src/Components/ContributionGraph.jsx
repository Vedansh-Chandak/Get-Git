import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";

import { useEffect, useState} from "react";




const ContributionGraph = ({ username })=>{
const [contributions, setContributions]= useState([]);

useEffect(()=>{
const fetchContributions = async ()=>{
    try {
        const { data } = await axios.get(`https://github-contributions-api.jogruber.de/v4/${username}`)
       const days = data.contributions
       .flatMap(week => week.days)
       .map(day => ({
        date: day.date,
        count: day.count
       }));
       setContributions(days);
    
    } catch (error) {
        console.log("error fetching contributions", error)
    }
}

fetchContributions();
}, [username])

return (
    <div className="my-4">
      <h2 className="text-lg font-semibold mb-2">Contribution Activity</h2>
      <CalendarHeatmap
        startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
        endDate={new Date()}
        values={contributions}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          if (value.count >= 10) return 'color-scale-4';
          if (value.count >= 6) return 'color-scale-3';
          if (value.count >= 3) return 'color-scale-2';
          return 'color-scale-1';
        }}
        tooltipDataAttrs={(value) =>
          value.date ? { 'data-tip': `${value.date}: ${value.count} contributions` } : {}
        }
        showWeekdayLabels
      />
    </div>
  );


}

export default ContributionGraph;