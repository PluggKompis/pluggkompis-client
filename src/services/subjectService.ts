import { api } from "./api";
import { Subject, OperationResult } from "@/types";

export const subjectService = {
  // Get all subjects (for dropdowns, filters, etc.)
  getAll: async (): Promise<OperationResult<Subject[]>> => {
    const response = await api.get<OperationResult<Subject[]>>("/subjects");
    return response.data;
  },
};
