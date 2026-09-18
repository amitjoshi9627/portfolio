import { useEffect, useState } from "react";

export type TimeOfDay = "dawn" | "day" | "sunset" | "night";

export function useTimeLighting(): TimeOfDay {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("night");

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 10) setTimeOfDay("dawn");
    else if (hour >= 10 && hour < 16) setTimeOfDay("day");
    else if (hour >= 16 && hour < 20) setTimeOfDay("sunset");
    else setTimeOfDay("night");
  }, []);

  return timeOfDay;
}
