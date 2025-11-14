import React, { useEffect, useState } from "react";
import {
  FileText,
  MapPin,
  Phone,
  RefreshCcw,
  Mail,
  Building,
  Star,
  Pencil,
  ArrowLeft,
  Briefcase,
  Wallet,
  TrendingUp,
  Laptop,
  Clock,
  Shield,
  Users,
  Info,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../loaders/Spinner";
import Tippy from "@tippyjs/react";
import ToolTip from "../ui/ToolTip";
import { getProfileById } from "../../services/profileServices";
import { div } from "framer-motion/client";
import NoData from "../ui/NoData";
import ViewSection from "../ui/ViewSection";
import ViewInfo from "../ui/ViewInfo";

const IconButton = ({ title, icon }) => (
  <Tippy
    content={title}
    placement="top"
    arrow={false}
    animation="fade"
    duration={100}
    theme="custom"
  >
    <div className="relative  flex justify-center items-center px-2 py-1.5 bg-gray-600 text-white text-sm rounded-md cursor-pointer">
      {icon}
    </div>
  </Tippy>
);

const ViewProfile = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileById();
  }, [id]);

  const fetchProfileById = async () => {
    setLoading(true);
    try {
      const res = await getProfileById(id);
      if (res.success && res.profile) setProfile(res.profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 ">
          <h2 className="text-2xl font-semibold ">Profile Info </h2>
          {!loading && profile.profileCode ? (
            <p className="text-dark bg-light dark:bg-white text-[12px] px-[2px] py-0 border-b border-dark  rounded font-[500]">
              {" "}
              # {profile.profileCode}
            </p>
          ) : (
            <Spinner size={20} color="#3b82f6" />
          )}
        </div>

        <button
          className="flex items-center gap-2 "
          onClick={() => fetchProfileById()}
        >
          <ToolTip
            title="Refresh"
            placement="top"
            icon={<RefreshCcw size={16} />}
          />
        </button>
      </div>
      <div className=" mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg  border border-gray-300 dark:border-gray-600 ">
        <div>
          {loading ? (
            <div className="h-screen flex justify-center items-center text-center py-10 text-gray-500">
              <Spinner size={50} color="#3b82f6" text="Loading ..." />
            </div>
          ) : profile ? (
            <div className="space-y-8">
              {/* Header */}
              <div className="sticky top-0  p-6 z-10 flex flex-wrap justify-between items-center rounded-lg border border-gray-300 dark:border-gray-600 pb-4">
                <div className="flex items-center gap-5">
                  <div className="relative w-16 h-16 flex items-center justify-center rounded-lg border-b-[3px]  border-dark  bg-light dark:bg-white  text-3xl font-semibold text-dark shadow-inner">
                    {profile.fullName.slice(0, 2).toUpperCase()}
                    <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-dark ">
                      {profile.fullName}
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {profile.techStack}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs font-[500] text-white rounded-md ${
                        profile.status === "Active"
                          ? "bg-green-600"
                          : profile.status === "Banned"
                          ? "bg-red-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {profile.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/profilemanagement/edit-profile/${profile._id}`
                      )
                    }
                    className="flex items-center gap-2 px-3 py-1.5 bg-dark text-white text-sm rounded-md hover:opacity-90 transition"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() =>
                      navigate("/admin/profilemanagement/profiles")
                    }
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:opacity-90 transition"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                </div>
              </div>
              {/* Grid Layout */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="md:col-span-1 space-y-6">
                  {profile.resume && (
                    <ViewSection title="Resume" icon={<FileText size={18} />}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-dark ">
                          <FileText size={18} />
                          {profile.resume.originalName}
                        </div>
                        <a
                          href={`https://crm-backend-qbz0.onrender.com/${profile.resume.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dark  text-sm underline"
                        >
                          View
                        </a>
                      </div>
                    </ViewSection>
                  )}

                  {/* Personal Information */}
                  <ViewSection
                    title="Personal Information"
                    icon={<Users size={18} />}
                  >
                    <div className="space-y-3">
                      <InfoItem
                        icon={<Mail size={16} />}
                        label="Email"
                        value={profile.email}
                      />
                      <InfoItem
                        icon={<Phone size={16} />}
                        label="Phone"
                        value={profile.phone}
                      />
                      {profile.alternatePhone && (
                        <InfoItem
                          icon={<Phone size={16} />}
                          label="Alt Phone"
                          value={profile.alternatePhone}
                        />
                      )}
                      <InfoItem
                        icon={<MapPin size={16} />}
                        label="Current Location"
                        value={profile.currentLocation}
                      />
                      <InfoItem
                        icon={<MapPin size={16} />}
                        label="Preferred Location"
                        value={profile.preferredLocation}
                      />
                    </div>
                  </ViewSection>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Professional Information */}
                  <ViewSection
                    title="Professional Information"
                    icon={<Briefcase size={18} />}
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <InfoItem
                        icon={<Building size={16} />}
                        label="Current Company"
                        value={profile.currentCompany}
                      />
                      <InfoItem
                        icon={<Briefcase size={16} />}
                        label="Total Experience"
                        value={profile.totalExp}
                      />
                      <InfoItem
                        icon={<Wallet size={16} />}
                        label="Current CTC"
                        value={`₹${profile.currentCTC}`}
                      />
                      <InfoItem
                        icon={<TrendingUp size={16} />}
                        label="Expected CTC"
                        value={`₹${profile.expectedCTC}`}
                      />
                      <InfoItem
                        icon={<Laptop size={16} />}
                        label="Work Mode"
                        value={profile.workMode}
                      />
                      <InfoItem
                        icon={<Clock size={16} />}
                        label="Notice Period"
                        value={profile.noticePeriod}
                      />
                      <InfoItem
                        icon={<Shield size={16} />}
                        label="Candidate Status"
                        value={profile.status}
                      />
                      <InfoItem
                        icon={<Users size={16} />}
                        label="Candidate Source"
                        value={profile.candidateSource}
                      />
                    </div>
                  </ViewSection>

                  {/* Additional Information */}
                  <ViewSection
                    title="Additional Information"
                    icon={<Info size={18} />}
                  >
                    {profile.skills?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-dark dark:text-white flex items-center gap-1">
                          <Star size={16} /> Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill, i) => (
                            <div key={i}>
                              <div className="px-3 py-1 text-sm rounded-md border border-blue-300 dark:border-blue-700 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                                {skill}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {profile.description && (
                      <div className="mb-3">
                        <h4 className="font-semibold mb-2 text-dark dark:text-white">
                          Description
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {profile.description}
                        </p>
                      </div>
                    )}

                    {/* Submitted Info */}
                    {profile.submittedBy && (
                      <div className="border-t pt-3 text-xs text-gray-500 dark:text-gray-400">
                        Submitted by:{" "}
                        <strong>{profile.submittedBy.fullName}</strong> (
                        {profile.submittedBy.email}) <br />
                        Created at:{" "}
                        {new Date(profile.createdAt).toLocaleString()}
                      </div>
                    )}
                  </ViewSection>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-[70vh] flex justify-center items-center">
              <NoData title="No Profile Data" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
const Section = ({ title, icon, children }) => (
  <section className="border border-gray-300 dark:border-gray-600 rounded-lg p-5 bg-white dark:bg-gray-800 transition">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2">
      {icon && <span className=" dark:text-white">{icon}</span>}
      {title}
    </h3>
    {children}
  </section>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
    {icon && (
      <span className="mt-0.5 text-gray-500 dark:text-gray-400">{icon}</span>
    )}
    <p>
      <span className="font-medium">{label}:</span> {value || "-"}
    </p>
  </div>
);

export default ViewProfile;
