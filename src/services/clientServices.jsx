import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getActiveClients = () => {
  return fetchHandler(`/api/clients?status=active`);
};

export const getAllClients = (
  page = 1,
  limit = 5,
  tab = "All",
  search = ""
) => {
  let url = `/api/clients?page=${page}&limit=${limit}`;
  if (tab === "Active") url += "&status=active";
  if (tab === "InActive") url += "&status=inactive";
  if (search.trim() !== "") url += `&search=${encodeURIComponent(search)}`;
  return fetchHandler(url);
};

export const getAllOptions = () => {
  return fetchHandler("/api/clients/options");
};

export const getClientById = (id) => fetchHandler(`/api/clients/${id}`);

export const addClients = (clientData) =>
  fetchHandler("/api/clients", "POST", clientData);

export const updateClient = (id, clientData) =>
  fetchHandler(`/api/clients/${id}`, "PUT", clientData);

// Requirements
export const getRequirementById = (id) =>
  fetchHandler(`/api/requirements/${id}`);

export const getRequirementsOptions = () => {
  return fetchHandler("/api/requirements/options");
};

export const addClientsRequirement = (clientData) =>
  fetchHandler("/api/requirements", "POST", clientData);

export const getAllRequirements = (
  page = 1,
  limit = 5,
  tab = "All",
  search = ""
) => {
  let url = `/api/requirements?page=${page}&limit=${limit}`;
  if (tab === "Active") url += "&status=active";
  if (tab === "InActive") url += "&status=inactive";
  if (search.trim() !== "") url += `&search=${encodeURIComponent(search)}`;
  return fetchHandler(url);
};
// return fetchHandler("/api/requirements");
