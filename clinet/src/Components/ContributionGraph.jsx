import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { addDays, subDays } from "date-fns";


const ContributionGraph = ({ username }) => {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/github/contributions/${username}`);
        const data = await res.json();
        setContributions(data);
      } catch (error) {
        console.error("Failed to load contributions:", error);
      }
    };

    if (username) fetchContributions();
  }, [username]);

  return (
    <div className="my-6 bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-800 text-white">
      <h2 className="text-xl font-semibold mb-4 text-center text-white">
        GitHub Contributions
      </h2>

      <div className="overflow-x-auto">
        <CalendarHeatmap
          startDate={subDays(new Date(), 365)}
          endDate={addDays(new Date(), 0)}
          values={contributions}
          classForValue={(value) => {
            if (!value || value.count === 0) return "fill-zinc-800";
            if (value.count < 5) return "fill-green-900";
            if (value.count < 10) return "fill-green-700";
            if (value.count < 20) return "fill-green-600";
            return "fill-green-400";
          }}
          tooltipDataAttrs={(value) => {
            if (!value || !value.date) return {};
            return {
              "data-tip": `${value.date}: ${value.count} contribution${value.count !== 1 ? "s" : ""}`,
            };
          }}
          showWeekdayLabels
        />
      </div>
    </div>
  );
};

export default ContributionGraph;
