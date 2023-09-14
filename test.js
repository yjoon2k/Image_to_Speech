import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { RNCamera } from "react-native-camera";
import CameraRoll from "@react-native-community/cameraroll";

const CameraScreen = () => {
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      savePicture(data.uri);
    }
  };

  const savePicture = async (uri) => {
    try {
      await CameraRoll.save(uri, { type: "photo" });
      console.log("사진이 저장되었습니다.");
    } catch (error) {
      console.error("사진을 저장하는 중 오류가 발생했습니다.", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={RNCamera.Constants.Type.back}
        autoFocus={RNCamera.Constants.AutoFocus.on}
      />
      <View style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          onPress={takePicture}
          style={{ padding: 16, backgroundColor: "white", borderRadius: 40 }}
        >
          <Text style={{ fontSize: 24 }}>사진 찍기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CameraScreen;
