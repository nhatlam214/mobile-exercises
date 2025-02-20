import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";

const ballImages = [
  require("./assets/ball1.png"),
  require("./assets/ball2.png"),
  require("./assets/ball3.png"),
  require("./assets/ball4.png"),
  require("./assets/ball5.png")
];

const Magic8Ball = () => {
  const [ballImage, setBallImage] = useState(ballImages[0]);

  useEffect(() => {
    // Preload images by resolving asset source
    ballImages.forEach((image) => Image.resolveAssetSource(image));
  }, []);

  const shakeBall = () => {
    const randomIndex = Math.floor(Math.random() * ballImages.length);
    setBallImage(ballImages[randomIndex]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={shakeBall} style={styles.ballContainer}>
        <Image source={ballImage} style={styles.ball} fadeDuration={0} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
  },
  ballContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  ball: {
    width: 300,
    height: 300,
  },
});

export default Magic8Ball;