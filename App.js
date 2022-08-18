import { StatusBar } from "expo-status-bar";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CLEAR, colors, colorsToEmoji, ENTER } from "./src/constants";
import Keyboard from "./src/components/Keyboard";
import { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
const NUMBER_OF_TRIES = 6;
const getRandomNumber = (max,min) => {
  return Math.floor(Math.random() * (max - min) ) + min;
};
const number = getRandomNumber(1,20);
const words = [
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
  "hello",
  "world",
];
export default function App() {
  const word = words[number];
  const letters = word.split("");
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );
  const [gameState, setGameState] = useState("playing");
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  useEffect(() => {
    checkGameState();
  }, [currentRow]);

  const checkGameState = () => {
    if (checkIfWon() && gameState != "won") {
      Alert.alert("Hurray", "You won!", [
        { text: "Share", onPress: shareScore },
      ]);
      setGameState("won");
    } else if (checkIfLost() && gameState != "lost") {
      Alert.alert("Lost");
      setGameState("lost");
    }
  };
  const checkIfWon = () => {
    const row = rows[currentRow - 1];
    return row?.every((letter, i) => letter == letters[i]);
  };
  const checkIfLost = () => {
    return !checkIfWon() && currentRow == rows.length;
  };
  const shareScore = () => {
    const textShare = rows
      .map((row, i) =>
        row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
      )
      .filter((row) => row)
      .join("\n");
    Clipboard.setString("Wordle - \n" + textShare);
    Alert.alert("Copied Successfully", "Share your score on your social media");
  };

  const copyArray = (arr) => {
    return [...arr.map((rows) => [...rows])];
  };
  const onKeyPressed = (key) => {
    if (gameState !== "playing") return;
    const updatedRows = copyArray(rows);
    if (key == CLEAR) {
      if (currentCol - 1 >= 0) {
        updatedRows[currentRow][currentCol - 1] = "";
        setRows(updatedRows);
        setCurrentCol(currentCol - 1);
      }
      return;
    }
    if (key === ENTER) {
      if (currentCol == rows[0].length) {
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      }
      return;
    }
    if (currentCol == rows[0].length) return;

    updatedRows[currentRow][currentCol] = key;
    // setCurrentCol(prev=>{
    //   if(prev==letters.length-1)return 0;
    //   else return prev+=1;
    // })
    // setCurrentRow(prev=>{
    //   if(currentCol==letters.length-1)return prev+=1;
    //   return prev
    // })
    setRows(updatedRows);
    setCurrentCol(currentCol + 1);
  };
  const isCellActive = (row, col) => {
    return currentRow == row && currentCol == col;
  };

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];

    if (row >= currentRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };
  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBGColor(i, j) === color)
    );
  };

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View key={"row-" + i} style={styles.row}>
            {row.map((letter, j) => (
              <View
                key={"row-" + j + "cell-" + j}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j)
                      ? colors.grey
                      : colors.darkgrey,
                    backgroundColor: getCellBGColor(i, j),
                  },
                ]}
              >
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        greyCaps={greyCaps}
        yellowCaps={yellowCaps}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
    paddingTop: 26,
  },

  map: {
    alignSelf: "stretch",
    marginVertical: 20,
    flexDirection: "column",
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1,
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 28,
  },
});
