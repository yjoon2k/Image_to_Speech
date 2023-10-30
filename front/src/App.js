import React, { useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState("");
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file_ = event.target.files[0];
    setFile(file_);
    const reader = new FileReader();

    reader.onload = function () {
      setSelectedImage(reader.result);
    };

    reader.readAsDataURL(file_);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (file == null) {
      setResult("사진을 먼저 선택한 후 업로드해주세요");
    } else {
      const formData = new FormData();
      formData.append("image", file);
      console.log("uploading");
      try {
        const response = await fetch(
          "https://t-helper.aolda.net/api/translate",
          {
            method: "POST",
            body: formData,
          }
        );

        const text = await response.text();
        setResult("번역 결과: " + text);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const handleInitiate = (e) => {
    setResult(null);
  };

  return (
    <div className="App">
      <h1 style={{ marginBottom: 5 }}>
        <span>번역할 텍스트</span>가 담긴 사진📸을 업로드 해주세요
      </h1>
      <a>powered by ACE/Aolda Web Service</a>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleImageUpload} accept="image/*" />
        <input type="submit" value="업로드" onSubmit={handleFormSubmit} />
      </form>
      <form onSubmit={handleInitiate}>
        <input type="initiate" value="초기화" onSubmit={handleInitiate} />
      </form>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          marginTop: 20,
        }}
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="선택된 이미지"
            style={{ width: "30vw", margin: "0 20px" }}
          />
        )}
        <p
          style={{
            width: "30vw",
            border: "1px solid lightgrey",
            minHeight: "50vh",
            margin: "0 20px",
            padding: "1%",
            textAlign: "center",
          }}
        >
          {result}
        </p>
      </div>
    </div>
  );
}

export default App;
