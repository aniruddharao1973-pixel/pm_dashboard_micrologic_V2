// src/api/aiMetaApi.js
import { useAxios } from "./axios";

export const useAiMetaApi = () => {
  const api = useAxios();

  const fetchAiCompanies = async () => {
    const res = await api.get("/ai/meta/companies");
    return res.data; // ✅ returns array of company names
  };

  return {
    fetchAiCompanies,
  };
};
