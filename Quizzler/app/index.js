import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

const QuizData = [
  {
    question: "The Great Wall of China is visible from space.",
    answer: false
  },
  {
    question: "Tomatoes are vegetables.",
    answer: false
  },
  {
    question: "An octopus has three hearts.",
    answer: true
  },
  {
    question: "The Mona Lisa has no eyebrows.",
    answer: true
  }
];

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswer = (selectedAnswer) => {
    const correctAnswer = QuizData[currentQuestionIndex].answer;
    
    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < QuizData.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1C1C1C" barStyle="light-content" />
      <View style={styles.quizContainer}>
        <Text style={styles.appTitle}>Quizzler</Text>
        
        {showScore ? (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              Your score: {score} out of {QuizData.length}
            </Text>
            <TouchableOpacity 
              style={styles.restartButton}
              onPress={restartQuiz}
            >
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {QuizData[currentQuestionIndex].question}
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.trueButton}
                onPress={() => handleAnswer(true)}
              >
                <Text style={styles.buttonText}>Đúng</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.falseButton}
                onPress={() => handleAnswer(false)}
              >
                <Text style={styles.buttonText}>Sai</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.progressText}>
              {currentQuestionIndex + 1}/{QuizData.length}
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  quizContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
  },
  questionContainer: {
    backgroundColor: '#262626',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    lineHeight: 30,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  trueButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  falseButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  progressText: {
    color: '#BBBBBB',
    fontSize: 16,
    marginTop: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  restartButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 25,
    width: 200,
    alignItems: 'center',
  }
});