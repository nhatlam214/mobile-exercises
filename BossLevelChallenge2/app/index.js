import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ImageBackground } from 'react-native';

// Story data - each story point has a story text and two choice options
// Each choice leads to the next story point ID
const storyData = [
  {
    id: 0,
    storyText: "Your car has blown a tire on a winding road in the middle of nowhere with no cell phone reception. You decide to hitchhike. A rusty pickup truck rumbles to a stop next to you. A man with a wide-brimmed hat and soulless eyes opens the passenger door for you and says: \"Need a ride, boy?\"",
    choice1: "I'll hop in. Thanks for the help!",
    choice1Destination: 2,
    choice2: "Well, I don't have many options. Better ask him if he's a murderer.",
    choice2Destination: 1,
  },
  {
    id: 1,
    storyText: "He laughs and says, \"I've never killed anyone before.\" He starts driving. As you begin to drive, the stranger starts talking about his relationship with his mother. He gets angrier and angrier by the minute. He asks you to open the glove box. Inside you find a bloody knife, two severed fingers, and a cassette tape. He reaches for the glove box.",
    choice1: "I love cassette tapes! Hand him the tape.",
    choice1Destination: 5,
    choice2: "It's him or me. Take the knife and stab him.",
    choice2Destination: 4,
  },
  {
    id: 2,
    storyText: "As you begin to drive, the stranger starts talking about his relationship with his mother. He gets angrier and angrier by the minute. He asks you to open the glove box. Inside you find a bloody knife, two severed fingers, and a cassette tape. He reaches for the glove box.",
    choice1: "I love cassette tapes! Hand him the tape.",
    choice1Destination: 5,
    choice2: "It's him or me. Take the knife and stab him.",
    choice2Destination: 4,
  },
  {
    id: 3,
    storyText: "You bond with the murderer while crooning verses of \"Can you feel the love tonight\". He drops you off at the next town. Before you go, he asks you if you know any good places to dump bodies. You reply: \"Try the pier.\"",
    choice1: "Restart",
    choice1Destination: 0,
    choice2: "",
    choice2Destination: 0,
  },
  {
    id: 4,
    storyText: "As you smash through the guardrail and careen towards the jagged rocks below you reflect on the dubious wisdom of stabbing someone while they are driving a car you're in.",
    choice1: "Restart",
    choice1Destination: 0,
    choice2: "",
    choice2Destination: 0,
  },
  {
    id: 5,
    storyText: "You bond with the murderer while crooning verses of \"Can you feel the love tonight\". He drops you off at the next town. Before you go, he asks you if you know any good places to dump bodies. You reply: \"Try the pier.\"",
    choice1: "Restart",
    choice1Destination: 0,
    choice2: "",
    choice2Destination: 0,
  },
];

export default function App() {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  
  const handleChoice = (destinationIndex) => {
    setCurrentStoryIndex(destinationIndex);
  };

  const currentStory = storyData[currentStoryIndex];
  const isEndingStory = !currentStory.choice2;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground 
        source={{ uri: 'https://via.placeholder.com/600/000000/FFFFFF/?text=Road' }} 
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Text style={styles.appTitle}>Destini</Text>
          
          <View style={styles.storyContainer}>
            <Text style={styles.storyText}>{currentStory.storyText}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.choiceButton}
              onPress={() => handleChoice(currentStory.choice1Destination)}
            >
              <Text style={styles.buttonText}>{currentStory.choice1}</Text>
            </TouchableOpacity>
            
            {!isEndingStory && (
              <TouchableOpacity 
                style={styles.choiceButton}
                onPress={() => handleChoice(currentStory.choice2Destination)}
              >
                <Text style={styles.buttonText}>{currentStory.choice2}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    justifyContent: 'space-between',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  storyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  storyText: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    lineHeight: 30,
  },
  buttonContainer: {
    marginBottom: 50,
  },
  choiceButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  }
});