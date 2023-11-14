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
  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append("image", uri);
    console.log("uploading");
    try {
      const response = await fetch("https://t-helper.aolda.net/api/translate", {
        method: "POST",
        body: formData,
      });
      const text = await response.text();
      setResponseText(text);
    } catch (error) {
      console.error("이미지 업로드 중 오류가 발생했습니다.", error);
    }
  };
  const takePicture = async () => {
    console.log("사진 찍음");
    try {
      const { uri } = await cameraRef.current.takePictureAsync();
      console.log(uri.type);
      //uploadImage(uri);
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
