import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av";

const sounds = [
  require("./assets/note1.wav"),
  require("./assets/note2.wav"),
  require("./assets/note3.wav"),
  require("./assets/note4.wav"),
  require("./assets/note5.wav"),
  require("./assets/note6.wav"),
  require("./assets/note7.wav"),
];

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

const playSound = async (index) => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    const { sound } = await Audio.Sound.createAsync(sounds[index]);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default function App() {
  return (
    <View style={styles.container}>
      {sounds.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.key, { backgroundColor: colors[index] }]}
          onPress={() => playSound(index)}
        >
          <Text style={styles.text}>Note {index + 1}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  key: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});