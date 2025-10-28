import React, { useState } from "react";
import { Save } from "lucide-react";
import Button from "../components/buttons/Button";
import Input from "../components/formInput/Input";
import SelectField from "../components/formInput/SelectField";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?worker";
import * as yup from "yup";
pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();

// ✅ Yup schema
const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
    .required("Phone is required"),
  location: yup.string().required("Preferred location is required"),
  company: yup.string().required("Current company is required"),
  currentLocation: yup.string().required("Current location is required"),
  currentCTC: yup.string().required("Current CTC is required"),
  expectedCTC: yup.string().required("Expected CTC is required"),
  technology: yup.string().required("Technology / Skills are required"),
  workMode: yup.string().required("Work mode is required"),
  noticePeriod: yup.string().required("Notice period is required"),
});

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
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // Handle input change
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // Handle input change with CTC formatting
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "currentCTC" || name === "expectedCTC") {
      const numericValue = value.replace(/\D/g, "");
      const formattedValue = numericValue
        ? new Intl.NumberFormat("en-IN").format(Number(numericValue))
        : "";
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Extract data from resume
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

    // Basic regex extraction
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

  // ✅ Handle form submit with Yup validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    try {
      await schema.validate(formData, { abortEarly: false });
      console.log("Profile Submitted:", formData);
      setSuccessMsg("Profile submitted successfully!");
      setFormData({
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
      setResumeFile(null);
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        console.error(err);
      }
    }
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
          <Input
            id="name"
            name="name"
            labelName="Full Name"
            value={formData.name}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            id="email"
            type="text"
            name="email"
            labelName="Email"
            value={formData.email}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            id="phone"
            name="phone"
            labelName="Phone"
            value={formData.phone}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            id="location"
            name="location"
            labelName="Preferred Location"
            value={formData.location}
            handleChange={handleChange}
            errors={errors}
          />
        </div>

        {/* Professional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="company"
            name="company"
            labelName="Current Company"
            value={formData.company}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            id="currentLocation"
            name="currentLocation"
            labelName="Current Location"
            value={formData.currentLocation}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            id="currentCTC"
            name="currentCTC"
            labelName="Current CTC (e.g., 8 LPA)"
            value={formData.currentCTC}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            id="expectedCTC"
            name="expectedCTC"
            labelName="Expected CTC (e.g., 12 LPA)"
            value={formData.expectedCTC}
            handleChange={handleChange}
            errors={errors}
          />

          <SelectField
            id="work_mode"
            name="workMode"
            label="Work Mode"
            value={formData.workMode}
            options={["Office", "Hybrid", "Remote"]}
            handleChange={handleChange}
            error={errors.workMode}
          />

          <Input
            id="noticePeriod"
            name="noticePeriod"
            labelName="Notice Period (e.g., 30 Days)"
            value={formData.noticePeriod}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            id="technology"
            name="technology"
            labelName="Primary Technology / Skills"
            value={formData.technology}
            handleChange={handleChange}
            errors={errors}
            className="col-span-2"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <Button type="submit" text="Submit" icon={<Save size={18} />} />
        </div>

        {successMsg && (
          <p className="text-green-600 text-sm mt-3 font-medium">
            {successMsg}
          </p>
        )}
      </form>
    </div>
  );
};

export default ProfileSubmission;
