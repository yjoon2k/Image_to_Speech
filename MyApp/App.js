import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    console.log("사진 찍음");
    if (cameraRef) {
      console.log("사진 찍음");
      try {
        const { uri } = await cameraRef.takePictureAsync();
        savePicture(uri);
      } catch (error) {
        console.error("사진을 찍는 중 오류가 발생했습니다.", error);
      }
    }
  };

  const savePicture = async (uri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Expo-Camera", asset, false);
      console.log("사진이 기기에 저장되었습니다.");
    } catch (error) {
      console.error("사진을 저장하는 중 오류가 발생했습니다.", error);
    }
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
      <Camera style={styles.camera}>
        <View style={styles.snapContainer}>
          <TouchableOpacity style={styles.snapbutton} onPress={takePicture}>
            <Text style={styles.text}>사진찍기</Text>
          </TouchableOpacity>
        </View>
      </Camera>
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
    flexDirection: "row",
  },
  camera: {
    width: 300,
    height: 400,
  },
  buttonContainer: {
    flex: 0.5,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  button: {
    flex: 0.5,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: "white",
  },
  snapContainer: {
    flex: 0.5,
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  snapbutton: {
    flex: 0.5,
    alignSelf: "flex-end",
    alignItems: "center",
  },
});
