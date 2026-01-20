import { api } from "./api";
import { Child, AddChildRequest, UpdateChildRequest, OperationResult } from "@/types";

export const parentService = {
  // Get all children for logged-in parent
  getMyChildren: async (): Promise<OperationResult<Child[]>> => {
    const response = await api.get<OperationResult<Child[]>>("/children");
    return response.data;
  },

  // Add a child
  addChild: async (data: AddChildRequest): Promise<OperationResult<Child>> => {
    const response = await api.post<OperationResult<Child>>("/children", data);
    return response.data;
  },

  // Update a child
  updateChild: async (
    childId: string,
    data: UpdateChildRequest
  ): Promise<OperationResult<Child>> => {
    const response = await api.put<OperationResult<Child>>(`/children/${childId}`, data);
    return response.data;
  },

  // Delete a child
  deleteChild: async (childId: string): Promise<OperationResult<void>> => {
    const response = await api.delete<OperationResult<void>>(`/children/${childId}`);
    return response.data;
  },
};
