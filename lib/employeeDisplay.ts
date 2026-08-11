import { EmployeeProfile } from "@/types";

export function currentJobInfo(profile: EmployeeProfile) {
  return profile.job_tab.job_information.current;
}
export function currentStatus(profile: EmployeeProfile) {
  return profile.job_tab.employment_status.current;
}
export function currentCompensation(profile: EmployeeProfile) {
  return profile.job_tab.compensation.current;
}