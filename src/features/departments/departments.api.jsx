import { http } from "../../services/http/client";

export async function listDepartmentsApi() {
  const res = await http.get("/api/departments");
  return res.data?.data || [];
}

export async function createDepartmentApi(name) {
  const res = await http.post("/api/departments", { name });
  return res.data?.data;
}
