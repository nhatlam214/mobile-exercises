import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  StatusBar,
  ScrollView,
  Platform
} from 'react-native';

export default function App() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [gender, setGender] = useState('male');

  const calculateBMI = () => {
    if (height && weight) {
      // Convert height from cm to m
      const heightInMeters = parseFloat(height) / 100;
      const weightValue = parseFloat(weight);
      
      // BMI formula: weight (kg) / (height (m) * height (m))
      const bmi = weightValue / (heightInMeters * heightInMeters);
      setBmiResult(bmi.toFixed(1));
      
      // Set BMI category
      if (bmi < 18.5) {
        setBmiCategory('Underweight');
      } else if (bmi >= 18.5 && bmi < 25) {
        setBmiCategory('Normal');
      } else if (bmi >= 25 && bmi < 30) {
        setBmiCategory('Overweight');
      } else {
        setBmiCategory('Obese');
      }
    } else {
      alert('Please enter both height and weight');
    }
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setBmiResult(null);
    setBmiCategory('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>BMI CALCULATOR</Text>
        
        <View style={styles.genderSelection}>
          <TouchableOpacity 
            style={[
              styles.genderCard,
              gender === 'male' ? styles.activeGender : null
            ]}
            onPress={() => setGender('male')}
          >
            <Text style={styles.genderIcon}>♂</Text>
            <Text style={styles.genderText}>MALE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.genderCard,
              gender === 'female' ? styles.activeGender : null
            ]}
            onPress={() => setGender('female')}
          >
            <Text style={styles.genderIcon}>♀</Text>
            <Text style={styles.genderText}>FEMALE</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>HEIGHT (cm)</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="e.g. 180"
            placeholderTextColor="#8D8E98"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>WEIGHT (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="e.g. 75"
            placeholderTextColor="#8D8E98"
            keyboardType="numeric"
          />
        </View>
        
        {bmiResult && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Your BMI Result</Text>
            <Text style={styles.resultValue}>{bmiResult}</Text>
            <Text style={[
              styles.categoryText,
              bmiCategory === 'Underweight' ? styles.underweight : null,
              bmiCategory === 'Normal' ? styles.normal : null,
              bmiCategory === 'Overweight' ? styles.overweight : null,
              bmiCategory === 'Obese' ? styles.obese : null,
            ]}>
              {bmiCategory}
            </Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.calculateButton}
            onPress={calculateBMI}
          >
            <Text style={styles.buttonText}>CALCULATE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetCalculator}
          >
            <Text style={styles.resetButtonText}>RESET</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E21',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  genderSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genderCard: {
    flex: 1,
    backgroundColor: '#1D1E33',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    marginHorizontal: 5,
  },
  activeGender: {
    backgroundColor: '#FF0066',
  },
  genderIcon: {
    fontSize: 70,
    color: 'white',
  },
  genderText: {
    fontSize: 16,
    color: '#8D8E98',
    marginTop: 10,
  },
  inputCard: {
    backgroundColor: '#1D1E33',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#8D8E98',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#111328',
    color: 'white',
    height: 50,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    padding: Platform.OS === 'ios' ? 10 : 5,
  },
  resultCard: {
    backgroundColor: '#1D1E33',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 18,
    color: '#8D8E98',
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 10,
  },
  categoryText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  underweight: {
    color: '#3bb5fc',
  },
  normal: {
    color: '#24d876',
  },
  overweight: {
    color: '#ffd600',
  },
  obese: {
    color: '#ff2d00',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  calculateButton: {
    backgroundColor: '#FF0066',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8D8E98',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButtonText: {
    color: '#8D8E98',
    fontSize: 18,
    fontWeight: 'bold',
  },
});