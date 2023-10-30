import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  const convertImageToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onload = () => {
          resolve(reader.result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error("이미지를 base64로 변환하는 중 오류가 발생했습니다.");
    }
  };
  const uploadImage = async (uri) => {
    try {
      const base64Image = await convertImageToBase64(uri);
      const response = await fetch(
        "https://asia-northeast3-civil-icon-396606.cloudfunctions.net/Image_Translator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: jsonData,
        }
      );

      const data = await response.json();
      setResponseText(data);
      console.log("서버 응답:", data);
    } catch (error) {
      console.error("이미지 업로드 중 오류가 발생했습니다.", error);
    }
  };
  const takePicture = async () => {
    console.log("사진 찍음");
    try {
      const { uri } = await cameraRef.current.takePictureAsync();
      uploadImage(uri);
    } catch (error) {
      console.error("사진을 찍는 중 오류가 발생했습니다.", error);
    }
  };

  const switchCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  if (hasPermission === null) {
    return (
      <View>
        <Text style={styles.text}>No Permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
        <View style={styles.snapContainer}>
          <TouchableOpacity onPress={takePicture}>
            <Image
              source={require("/Users/sim-yeongjun/Desktop/self_coding/Image_to_speech/MyApp/camera.png")}
              style={styles.snapButtonImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.switchButton} onPress={switchCamera}>
            <Text style={styles.text}>전환</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <Text style={styles.responseText}>{responseText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  camera: {
    width: 350,
    height: 450,
    marginBottom: 20,
  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 16,
  },
  switchButton: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  snapContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  snapbutton: {
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 16,
    borderRadius: 5,
  },
  snapButtonImage: {
    alignSelf: "center",
    width: 20,
    height: 20,
    padding: 16,
    borderRadius: 5,
  },
  responseText: {
    fontSize: 18,
    color: "black",
    marginTop: 10,
  },
});
