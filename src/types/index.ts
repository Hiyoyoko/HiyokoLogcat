export interface LogLine {
  raw: string;
  level: string;
}

export interface Device {
  serial: string;
  status: string;
  model: string;
}
