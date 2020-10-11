import { Moment } from "moment";

export interface ScheduledTask {
  scheduledDate: Moment;
  start(): Promise<void>;
}
