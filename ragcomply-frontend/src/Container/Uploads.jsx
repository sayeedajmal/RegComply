import React, { useState } from "react";
import axiosInstance from "../axiosInstance";

function Uploads() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type.startsWith("image/"))
    ) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a valid PDF or image file.");
      setFile(null);
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        setIsUploading(true);

        const response = await axiosInstance.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status !== 200) {
          throw new Error("File upload failed");
        }

        setUploadUrl(response.data.uploadUrl);

        alert(`File uploaded: ${file.name}`);
      } catch (error) {
        setError("Error uploading file: " + error.message);
      } finally {
        setIsUploading(false);
      }
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <div className="upload-container p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload PDF or Image</h2>

      {/* File input */}
      <input
        type="file"
        accept=".pdf,image/*"
        onChange={handleFileChange}
        className="p-4 mb-4 border border-gray-300 rounded-lg border-dashed"
      />

      {/* Display selected file name */}
      {file && <p className="text-gray-700">Selected file: {file.name}</p>}

      {/* Display error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Upload button */}
      <button
        onClick={handleFileUpload}
        className="bg-blue-500 text-white py-2 px-6 rounded-lg mt-4"
      >
        Upload
      </button>

      {/* Show loading spinner when uploading */}
      {isUploading && (
        <div className="mt-6 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {/* Display upload URL */}
      {uploadUrl && (
        <div className="mt-4">
          <h3 className="font-semibold">File uploaded successfully!</h3>
          <a
            href={uploadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            View uploaded file
          </a>
        </div>
      )}
    </div>
  );
}

export default Uploads;
