import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";

const diceImages = {
  1: require("./assets/dice1.png"),
  2: require("./assets/dice2.png"),
  3: require("./assets/dice3.png"),
  4: require("./assets/dice4.png"),
  5: require("./assets/dice5.png"),
  6: require("./assets/dice6.png"),
};

const DiceeApp = () => {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);

  const rollDice = () => {
    setDice1(Math.floor(Math.random() * 6) + 1);
    setDice2(Math.floor(Math.random() * 6) + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.diceContainer}>
        <TouchableOpacity onPress={rollDice}>
          <Image source={diceImages[dice1]} style={styles.dice} />
        </TouchableOpacity>
        <TouchableOpacity onPress={rollDice}>
          <Image source={diceImages[dice2]} style={styles.dice} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3674B5",
  },
  diceContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dice: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
  },
});

export default DiceeApp;