// ---------- UKSHA RESPONSE ----------
export interface IMedicalData {
  count: number;
  next: string | null;
  previous: string | null;
  results: IMedicalDataResult[];
}

export interface IMedicalDataResult {
  theme: string;
  sub_theme: string;
  topic: string;
  geography_type: string;
  geography: string;
  geography_code: string;
  metric: string;
  metric_group: string;
  stratum: string;
  sex: string;
  age: string;
  year: number;
  month: number;
  epiweek: number;
  date: string;
  metric_value: number;
  in_reporting_delay_period: boolean;
}

// ---------- UKSHA RESPONSE END ----------
