import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import axios from "axios";
import { IMedicalData, IMedicalDataResult } from "../../app/interfaces";

const COVID_API_URL =
  "https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19/geography_types/Nation/geographies/England/metrics/COVID-19_testing_PCRcountByDay";

const DISEASES = [
  {
    name: "E-coli",
    url: "https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease/sub_themes/bloodstream_infection/topics/E-coli/geography_types/Nation/geographies/England/metrics/e-coli_cases_countsByOnsetType",
  },
  {
    name: "MSSA",
    url: "https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease/sub_themes/bloodstream_infection/topics/MSSA/geography_types/Nation/geographies/England/metrics/MSSA_cases_countsByOnsetType",
  },
  {
    name: "MRSA",
    url: "https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease/sub_themes/bloodstream_infection/topics/MRSA/geography_types/Nation/geographies/England/metrics/MRSA_cases_countsByOnsetType",
  },
];

interface CovidProcessedData {
  month: string;
  tests: number;
}

interface BloodProcessedData {
  disease: string;
  year: number;
  month: number;
  value: number;
}

// Create a medicalRouter that handles medical-related queries
export const medicalRouter = createTRPCRouter({
  fetchCovidTestingData: baseProcedure
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

      const processedData: CovidProcessedData[] = allResults.reduce(
        (acc, item) => {
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
        },
        [] as CovidProcessedData[]
      );

      return processedData;
    }),
  fetchBloodInfections: baseProcedure
    .input(
      z.object({
        nWeeks: z.number().min(1),
      })
    )
    .query(async ({ input }) => {
      const { nWeeks } = input;
      let allProcessedData: BloodProcessedData[] = [];

      for (const disease of DISEASES) {
        let nextUrl: string | null = disease.url;
        let allResults: IMedicalDataResult[] = [];

        while (nextUrl && allResults.length / 7 < nWeeks) {
          try {
            const response = await axios.get<IMedicalData>(nextUrl);
            const { results, next } = response.data;
            allResults = [...allResults, ...results];
            nextUrl = next;
          } catch (error) {
            console.error(`Error fetching ${disease.name} data:`, error);
            break;
          }
        }

        // Process and group the data by disease, year, and month, summing the values
        const groupedData = allResults.reduce((acc, item) => {
          const key = `${disease.name}-${item.year}-${item.month}`;
          if (!acc[key]) {
            acc[key] = {
              disease: disease.name,
              year: item.year,
              month: item.month,
              value: 0,
            };
          }
          acc[key].value += item.metric_value;
          return acc;
        }, {} as { [key: string]: BloodProcessedData });

        const processedData = Object.values(groupedData);
        allProcessedData = [...allProcessedData, ...processedData];
      }

      return allProcessedData;
    }),
});
