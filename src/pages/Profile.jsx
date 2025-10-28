import React, { useState } from "react";
import { Save } from "lucide-react";
import Button from "../components/buttons/Button";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?worker";
pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();

const ProfileSubmission = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    company: "",
    currentCTC: "",
    expectedCTC: "",
    technology: "",
    currentLocation: "",
    workMode: "",
    noticePeriod: "",
  });

  const [resumeFile, setResumeFile] = useState(null);

  // Handle input field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Extract text from PDF resume
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file only!");
      return;
    }

    setResumeFile(file);

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      text += strings.join(" ") + "\n";
    }

    // Regex-based extraction (basic)
    const nameMatch = text.match(/Name[:\-]?\s*([A-Za-z ]{3,})/i);
    const emailMatch = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
    const phoneMatch = text.match(/(\+91[-\s]?)?[0]?(91)?[6-9]\d{9}/);
    const companyMatch = text.match(
      /(?:Company|Organization)[:\-]?\s*([A-Za-z &]+)/i
    );
    const currentCTCMatch = text.match(
      /Current CTC[:\-]?\s*(\d+\.?\d*\s*(LPA|Lakhs)?)/i
    );
    const expectedCTCMatch = text.match(
      /Expected CTC[:\-]?\s*(\d+\.?\d*\s*(LPA|Lakhs)?)/i
    );
    const noticeMatch = text.match(/Notice Period[:\-]?\s*([A-Za-z0-9 ]+)/i);
    const techMatch = text.match(
      /(Skills|Technology|Technical Skills)[:\-]?\s*([A-Za-z0-9, ]+)/i
    );
    const locationMatch = text.match(/(?:Location|City)[:\-]?\s*([A-Za-z ]+)/i);

    // Update form data with extracted values
    setFormData((prev) => ({
      ...prev,
      name: nameMatch ? nameMatch[1].trim() : prev.name,
      email: emailMatch ? emailMatch[0] : prev.email,
      phone: phoneMatch ? phoneMatch[0] : prev.phone,
      company: companyMatch ? companyMatch[1].trim() : prev.company,
      currentCTC: currentCTCMatch ? currentCTCMatch[1].trim() : prev.currentCTC,
      expectedCTC: expectedCTCMatch
        ? expectedCTCMatch[1].trim()
        : prev.expectedCTC,
      noticePeriod: noticeMatch ? noticeMatch[1].trim() : prev.noticePeriod,
      technology: techMatch ? techMatch[2].trim() : prev.technology,
      location: locationMatch ? locationMatch[1].trim() : prev.location,
    }));
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Submitted:", formData);
    alert("Profile submitted successfully!");
  };

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-4">Profile Submission</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl p-6 border border-lightGray dark:border-darkGray bg-white dark:bg-darkBg"
      >
        {/* Resume Upload */}
        <div>
          <label className="block font-medium mb-1">Upload Resume</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            className="block w-full border rounded-md p-2"
          />
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
          <input
            type="text"
            name="location"
            placeholder="Preferred Location"
            value={formData.location}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Professional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="company"
            placeholder="Current Company"
            value={formData.company}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
          <input
            type="text"
            name="currentLocation"
            placeholder="Current Location"
            value={formData.currentLocation}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
          <input
            type="text"
            name="currentCTC"
            placeholder="Current CTC (e.g., 8 LPA)"
            value={formData.currentCTC}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
          <input
            type="text"
            name="expectedCTC"
            placeholder="Expected CTC (e.g., 12 LPA)"
            value={formData.expectedCTC}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
          <input
            type="text"
            name="technology"
            placeholder="Primary Technology / Skills"
            value={formData.technology}
            onChange={handleChange}
            className="border rounded-md p-2 w-full col-span-2"
          />
          <select
            name="workMode"
            value={formData.workMode}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          >
            <option value="">Select Work Mode</option>
            <option value="Office">Office</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
          <input
            type="text"
            name="noticePeriod"
            placeholder="Notice Period (e.g., 30 Days)"
            value={formData.noticePeriod}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" text="Add" icon={<Save size={18} />} />
        </div>
      </form>
    </div>
  );
};

export default ProfileSubmission;
