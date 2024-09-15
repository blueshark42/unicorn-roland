import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import axios from "axios";
import { IMedicalData, IMedicalDataResult } from "../../app/interfaces";

const COVID_API_URL =
  "https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19/geography_types/Nation/geographies/England/metrics/COVID-19_testing_PCRcountByDay";

interface ProcessedData {
  month: string;
  tests: number;
}

export const medicalRouter = createTRPCRouter({
  fetchMedicalData: baseProcedure
    .input(
      z.object({
        nMonths: z.number().min(1),
      })
    )
    .query(async ({ input }) => {
      const { nMonths } = input;

      let nextUrl: string | null = COVID_API_URL;
      let allResults: IMedicalDataResult[] = [];

      // Calculate the number of days to fetch based on the input months
      const currentDate = new Date();
      const pastDate = new Date(currentDate);
      pastDate.setMonth(currentDate.getMonth() - nMonths);

      // Fetch data until we reach the target months
      while (nextUrl) {
        try {
          const response = await axios.get<IMedicalData>(nextUrl);
          const { results, next } = response.data;

          // Filter results based on the desired date range
          const filteredResults = results.filter(
            (item) => new Date(item.date) >= pastDate
          );

          allResults = [...allResults, ...filteredResults];
          nextUrl = next;

          // If the earliest date is older than the desired range, stop fetching
          const earliestDate = new Date(
            filteredResults[filteredResults.length - 1]?.date
          );
          if (earliestDate < pastDate) break;
        } catch (error) {
          console.error("Error fetching medical data:", error);
          break;
        }
      }

      // Process the data into months and sum up the tests
      const processedData: ProcessedData[] = allResults.reduce((acc, item) => {
        const monthName = new Date(item.date).toLocaleString("default", {
          month: "long",
        });
        const year = item.year;

        const existingEntry = acc.find(
          (entry) => entry.month === `${monthName} ${year}`
        );

        if (existingEntry) {
          existingEntry.tests += item.metric_value;
        } else {
          acc.push({
            month: `${monthName} ${year}`,
            tests: item.metric_value,
          });
        }

        return acc;
      }, [] as ProcessedData[]);

      return processedData;
    }),
});
