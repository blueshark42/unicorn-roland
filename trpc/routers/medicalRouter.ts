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

// Create a medicalRouter that handles medical-related queries
export const medicalRouter = createTRPCRouter({
  fetchMedicalData: baseProcedure
    .input(
      z.object({
        nWeeks: z.number().min(1),
      })
    )
    .query(async ({ input }) => {
      const { nWeeks } = input;

      let nextUrl: string | null = COVID_API_URL;
      let allResults: IMedicalDataResult[] = [];

      while (nextUrl && allResults.length / 7 < nWeeks) {
        try {
          const response = await axios.get<IMedicalData>(nextUrl);
          const { results, next } = response.data;

          allResults = [...allResults, ...results];
          nextUrl = next;
        } catch (error) {
          console.error("Error fetching medical data:", error);
          break;
        }
      }

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
