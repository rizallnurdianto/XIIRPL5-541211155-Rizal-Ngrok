import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const getQuizzes = async () => {
    try {
      const response = await fetch(
        'https://719d-2001-448a-40aa-2145-7427-3579-5285-627e.ngrok-free.app/api/quizzes/'
      );
      const json = await response.json();
      setData(json.dataQuiz);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerPress = (answer, correctAnswer) => {
    if (!showCorrectAnswer) {
      setSelectedAnswer(answer);
      setShowCorrectAnswer(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
  };

  const renderAnswerButton = (answer, label, correctAnswer) => {
    const isSelected = selectedAnswer === answer;
    const isCorrectAnswer = correctAnswer === selectedAnswer;
    return (
      <TouchableOpacity
        style={[
          styles.answerOptions,
          {
            backgroundColor:
              isSelected ? isCorrectAnswer? 
              '#109010':
              '#dc143c':
              '#EEEEEE',
          },
        ]}
        onPress={() => handleAnswerPress(answer, correctAnswer)}
        disabled={showCorrectAnswer}
      >
        <Text
          style={{
            color:
              selectedAnswer === answer ? '#FFFFFF' : '#343434',
            fontSize: 16,
          }}
        >
          {`${label}. ${answer}`}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getQuizzes();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#343434" />
      ) : (
        <>
          <View style={styles.quizGroup}>
            {currentQuestionIndex < data.length && (
              <>
                <Text style={styles.quizQuestion}>
                  {data[currentQuestionIndex].id}.{` `}
                  {data[currentQuestionIndex].quiz}
                </Text>
                {renderAnswerButton(
                  data[currentQuestionIndex].a,
                  'A',
                  data[currentQuestionIndex].key
                )}
                {renderAnswerButton(
                  data[currentQuestionIndex].b,
                  'B',
                  data[currentQuestionIndex].key
                )}
                {renderAnswerButton(
                  data[currentQuestionIndex].c,
                  'C',
                  data[currentQuestionIndex].key
                )}
                {renderAnswerButton(
                  data[currentQuestionIndex].d,
                  'D',
                  data[currentQuestionIndex].key
                )}

                {showCorrectAnswer && (
                  <Text style={styles.quizKey}>
                    *Jawaban: {data[currentQuestionIndex].key}
                  </Text>
                )}

                <Text style={styles.selectedAnswer}>
                  Jawaban Anda: {selectedAnswer}
                </Text>
              </>
            )}
          </View>

          {showCorrectAnswer && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => {
                  if (currentQuestionIndex + 1 < data.length) {
                    setCurrentQuestionIndex(
                      currentQuestionIndex + 1
                    );
                    setSelectedAnswer(null);
                    setShowCorrectAnswer(false);
                  } else {
                    handleRestart();
                  }
                }}
              >
                <Text style={styles.buttonText}>
                  {currentQuestionIndex + 1 < data.length
                    ? 'Quiz Selanjutnya'
                    : 'Kerjakan Ulang'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  quizGroup: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
  },
  quizQuestion: {
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#343434',
  },
  answerOptions: {
    backgroundColor: '#E5E5E5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  quizKey: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#343434',
  },
  selectedAnswer: {
    color: '#343434',
    marginTop: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#343434',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
