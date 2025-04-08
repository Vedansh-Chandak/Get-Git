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
    <div className="my-6 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-center">
        GitHub Contributions
      </h2>
      <CalendarHeatmap
        startDate={subDays(new Date(), 365)}
        endDate={addDays(new Date(), 0)}
        values={contributions}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          if (value.count < 5) return "color-github-1";
          if (value.count < 10) return "color-github-2";
          if (value.count < 20) return "color-github-3";
          return "color-github-4";
        }}
        tooltipDataAttrs={(value) => {
          if (!value || !value.date) return {};
          return {
            "data-tip": `${value.date}: ${value.count} contributions`,
          };
        }}
        showWeekdayLabels
      />
    </div>
  );
};

export default ContributionGraph;
