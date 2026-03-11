import dayjs from "dayjs";
import { getHomeData, getUserTrainData } from "@/app/_lib/api/fetch-generated";

export async function needsOnboarding(): Promise<boolean> {
  try {
    const [trainDataRes, homeDataRes] = await Promise.all([
      getUserTrainData(),
      getHomeData(dayjs().format("YYYY-MM-DD")),
    ]);

    const hasTrainData =
      trainDataRes.status === 200 && trainDataRes.data !== null;
    const hasActivePlan = homeDataRes.status === 200;

    return !hasTrainData || !hasActivePlan;
  } catch {
    return true;
  }
}
