import React, { useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState("");
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mp3, setMp3] = useState(null);

  const decodeMp3 = (mp3String) => {
    const byteArray = new Uint8Array(
      mp3String.split("").map((char) => char.charCodeAt(0))
    );
    return URL.createObjectURL(new Blob([byteArray], { type: "audio/mpeg" }));
  };

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
        )
          .then((response) => response.json())
          .then((data) => {
            const { text, mp3 } = data;
            setResult(text);
            setMp3(mp3);
            handlePlayMp3();
          });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const handlePlayMp3 = () => {
    if (mp3 == null) {
      setResult("사진을 먼저 업로드한 후 실행해 주세요");
      return;
    }
    const audio = new Audio(decodeMp3(mp3));
    audio.play();
  };

  const handleInitiate = (e) => {
    setResult(null);
    setFile(null);
    setSelectedImage(null);
    setMp3(null);
  };

  return (
    <div className="App">
      <h1 style={{ marginBottom: 5 }}>
        <span>번역할 텍스트</span>가 담긴 사진📸을 업로드 해주세요
      </h1>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      <button onClick={handleFormSubmit} style={{ marginRight: "5vw" }}>
        업로드
      </button>
      <button
        onClick={handlePlayMp3}
        style={{ marginRight: "5vw", marginLeft: "5vw" }}
      >
        TTS 재생
      </button>
      <button onClick={handleInitiate} style={{ marginLeft: "5vw" }}>
        초기화
      </button>
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
      <a>powered by ACE/Aolda Web Service</a>
    </div>
  );
}

export default App;
