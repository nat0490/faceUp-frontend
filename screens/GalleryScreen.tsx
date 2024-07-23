import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removePhoto, UserState } from '../reducers/user';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function GalleryScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state: { user: UserState }) => state.user.value);
  // console.log(user);

  const [ bigPhoto, setBigPhoto ] = useState<boolean>(false);


  const photos = user.photos.map((data: string, i: number) => {
    // console.log(i);
    return (
      <View key={i} style={styles.photoContainer}>
        <TouchableOpacity onPress={() => dispatch(removePhoto(data))}>
        <FontAwesomeIcon icon={faXmark} />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => setBigPhoto(!bigPhoto)}> */}
          <Image source={{ uri: data }} style={bigPhoto? styles.bigPhoto : styles.photo } />
        {/* </TouchableOpacity> */}
      </View>
    );
  }); 

  // console.log(photos);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <Text style={styles.text}>Logged as: {user.email}</Text>

      <ScrollView contentContainerStyle={styles.galleryContainer}>
        {user.photos && photos}
      </ScrollView> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 100,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  galleryContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  photoContainer: {
    alignItems: 'flex-end',
    // width: 150,
    // height: 150,
  },
  photo: {
    margin: 5,
    // objectFit: 'cover',
    // resizeMode: 'cover',
    width: 150,
    height: 150,
  },
  bigPhoto: {
    margin: 5,
    // objectFit: 'cover',
    // resizeMode: 'cover',
    width: "100%",
    height: "100%",
  },
  title: {
    //fontFamily: 'Futura',
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,
  },
  deleteIcon: {
    marginRight: 10,
  },
  text: {
    marginBottom: 15,
  },
});
