import React, { useState, useRef, useEffect } from "react";
import { Button, message, Typography, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const VisualSearch = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Add effect to log state changes
  useEffect(() => {
    console.log("State updated:", {
      selectedFile: selectedFile
        ? {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
          }
        : null,
      previewUrl,
      loading,
      resultsCount: results.length,
      error,
    });
  }, [selectedFile, previewUrl, loading, results, error]);

  const handleFileSelect = (event) => {
    console.log("=== File Selection Started ===");
    console.log("Event:", event);
    console.log("Event target:", event.target);
    console.log("Files:", event.target.files);

    const file = event.target.files[0];
    console.log("Selected file:", file);

    if (!file) {
      console.log("No file selected");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.log("Invalid file type:", file.type);
      message.error("Please upload an image file!");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.log("File too large:", file.size);
      message.error("Image must be smaller than 5MB!");
      return;
    }

    console.log("File validation passed:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    try {
      // Set the file and create preview
      console.log("Setting selected file...");
      setSelectedFile(file);

      console.log("Creating preview URL...");
      const preview = URL.createObjectURL(file);
      console.log("Preview URL created:", preview);

      setPreviewUrl(preview);
      setError("");
      message.success("Image uploaded successfully");
      console.log("=== File Selection Completed Successfully ===");
    } catch (err) {
      console.error("Error during file processing:", err);
      message.error("Error processing the image");
    }
  };

  const handleSearch = async () => {
    console.log("=== Search Started ===");
    console.log("Selected file:", selectedFile);

    if (!selectedFile) {
      console.log("No file selected for search");
      message.error("Please select an image first");
      return;
    }

    try {
      console.log("Setting loading state...");
      setLoading(true);
      setError("");

      console.log("Creating FormData...");
      const formData = new FormData();
      formData.append("image", selectedFile);

      console.log(
        "Sending request to:",
        "https://urnanknit-backend.onrender.com/api/visual-search/search"
      );
      console.log("FormData contents:", {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
      });

      const response = await axios.post(
        "https://urnanknit-backend.onrender.com/api/visual-search/search",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log("Upload progress:", percentCompleted + "%");
          },
        }
      );

      console.log("Response received:", response.data);

      if (response.data.success) {
        console.log("Setting results...");
        setResults(response.data.results);
        message.success("Search completed successfully");
      } else {
        console.log("No results found");
        setError("No similar products found");
        message.warning("No similar products found");
      }
    } catch (error) {
      console.error("=== Search Error ===");
      console.error("Error object:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage = "Error performing visual search";
      if (error.response) {
        switch (error.response.status) {
          case 413:
            errorMessage = "Image file is too large";
            break;
          case 415:
            errorMessage = "Unsupported file type";
            break;
          case 500:
            errorMessage = "Server error occurred";
            break;
          case 404:
            errorMessage =
              "Visual search endpoint not found. Please check if the server is running and the endpoint is correct.";
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.message.includes("Network Error")) {
        errorMessage =
          "Cannot connect to the server. Please check if the server is running on port 8080.";
      }

      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      console.log("Setting loading state to false");
      setLoading(false);
      console.log("=== Search Completed ===");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Title level={4} className="text-center mb-6">
          Visual Search
        </Title>

        <div className="w-full max-w-xl mx-auto">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer block">
              <div className="text-4xl mb-4">📁</div>
              <p className="text-lg font-medium mb-2">
                Click to upload an image
              </p>
              <p className="text-sm text-gray-500">
                Support for a single image upload. Max size: 5MB
              </p>
            </label>
          </div>

          {previewUrl && (
            <div className="text-center mb-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-md"
              />
              <Text type="secondary" className="block mt-2">
                Selected file: {selectedFile?.name}
              </Text>
            </div>
          )}

          <div className="text-center">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading}
              disabled={!selectedFile}
              size="large"
              className="w-full"
            >
              {loading ? "Searching..." : "Search Similar Products"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-6 text-center">
            <Text type="danger">{error}</Text>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-8">
            <Title level={5} className="mb-4">
              Similar Products Found ({results.length})
            </Title>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <img
                    src={result.product.image}
                    alt={result.product.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <Text strong className="block mb-2">
                    {result.product.name}
                  </Text>
                  <Text type="secondary">
                    Similarity: {Math.round(result.similarity * 100)}%
                  </Text>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && results.length === 0 && selectedFile && (
          <div className="mt-8 text-center">
            <Empty description="No similar products found" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualSearch;
