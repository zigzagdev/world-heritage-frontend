import { createTopApi } from "./top-api";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
const topApi = createTopApi({ apiBase });

export const fetchTopPage = topApi.fetchTopPage;
export const fetchWorldHeritageDetail = topApi.fetchWorldHeritageDetail;
