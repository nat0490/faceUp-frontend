import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Camera, CameraView, CameraType, FlashMode } from 'expo-camera';
import { useDispatch } from 'react-redux';
import { addPhoto } from '../reducers/user';
import { useIsFocused } from "@react-navigation/native";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBoltLightning, faCircle, faRotateRight } from '@fortawesome/free-solid-svg-icons';

export default function SnapScreen() {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  

  // console.log(CameraType);
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState<CameraType>("back");
  const [flashMode, setFlashMode] = useState<FlashMode>("off");

  // console.log(flashMode);

  const cameraRef: any = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);



  const takePicture = async () => {
    // console.log('take picture');
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.3 });

      const response = await fetch(photo.uri);
      // const blob = await response.blob();

      const formData = new FormData();
      // formData.append('photoFromFront', blob, 'photo.jpg');
      formData.append('photoFromFront', {
        uri: photo.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
      
      // console.log("before fetch");
      // const uploadResponse = await fetch('http://192.168.1.106:3000/upload', {
      const uploadResponse = await fetch('http://192.168.1.237:3000/upload', {
        method: 'POST',
        body: formData,
      });

      // console.log("after fetch");
      const data = await uploadResponse.json();
      dispatch(addPhoto(data.url));
    }
  };


  

  if (!hasPermission || !isFocused) {
    return <View />;
  }

  return (
    <CameraView facing={type} flash={flashMode} ref={cameraRef} style={styles.camera}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => setType(type === "back" ? "front" : "back")}
          style={styles.button}
        >
          <FontAwesomeIcon icon={faRotateRight} color='#ffffff' />
          {/* <FontAwesome name='rotate-right' size={25} color='#ffffff' /> */}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFlashMode(flashMode === "off" ? "on" : "off")}
          style={styles.button}
        >
          <FontAwesomeIcon icon={faBoltLightning} color={flashMode === "off" ? '#ffffff' : '#e8be4b'}/>
          {/* <FontAwesome name='flash' size={25} color={flashMode === "off" ? '#ffffff' : '#e8be4b'} /> */}
        </TouchableOpacity>
      </View>

      <View style={styles.snapContainer}>
        <TouchableOpacity onPress={() => cameraRef && takePicture()}>
          <FontAwesomeIcon icon={faCircle} size={50}  color='#ffffff' />
          {/* <FontAwesome name='circle-thin' size={95} color='#ffffff' /> */}
        </TouchableOpacity>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  buttonsContainer: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 50,
  },
  snapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 25,
  },
});
