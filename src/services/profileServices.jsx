import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getAllProfiles = (
  page = 1,
  limit = 5,
  tab = "All",
  search = ""
) => {
  let url = `/api/profiles?page=${page}&limit=${limit}`;
  if (tab === "Active") url += "&status=Active";
  if (tab === "InActive") url += "&status=Inactive";
  if (tab === "Banned") url += "&status=Banned";
  if (tab === "Defaulter") url += "&status=Defaulter";
  if (search.trim() !== "") url += `&search=${encodeURIComponent(search)}`;
  return fetchHandler(url);
};

export const getProfileById = (id) => fetchHandler(`/api/profiles/${id}`);

export const addProfile = (profileData) =>
  fetchHandler("/api/profiles", "POST", profileData);

export const updateProfile = (id, profileData) =>
  fetchHandler(`/api/profiles/${id}`, "PUT", profileData);

export const updateProfileStatus = (id, status) => {
  return fetchHandler(`/api/profiles/${id}`, "PUT", status);
};
