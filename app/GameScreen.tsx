import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { WebView } from "react-native-webview";
import { Dimensions, TextInput, Animated } from "react-native";
import axios from "axios";
import { Entypo, Ionicons } from "@expo/vector-icons";

export default function GameScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [submitted, setSubmitted] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [result, setResult] = useState<number | undefined>();
  const [game, setGame] = useState<number | undefined>();
  const [playerName, setPlayerName] = useState("");
  const [targetRgb, setTargetRgb] = useState<{
    r: number;
    g: number;
    b: number;
  } | null>(null);
  const [photoData, setPhotoData] = useState<{
    uri: string;
    base64: string;
    width: number;
    height: number;
  } | null>(null);
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number } | null>(
    null
  );

  const vanishAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    setGame(1);
    setTargetRgb({ r, g, b });
  }, [game]);

  useEffect(() => {
    if (rgb && targetRgb) {
      const result = [];
      result.push(
        Math.floor(100 - (Math.abs(rgb.r - targetRgb.r) / 255) * 100)
      );
      result.push(
        Math.floor(100 - (Math.abs(rgb.g - targetRgb.g) / 255) * 100)
      );
      result.push(
        Math.floor(100 - (Math.abs(rgb.b - targetRgb.b) / 255) * 100)
      );
      const resultAverage = result.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );
      const trueResult = Math.floor(resultAverage / 3);
      setResult(trueResult);
    }
  }, [rgb]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const TakePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({
      base64: true,
      skipProcessing: true,
    });
    if (photo?.base64) {
      setPhotoData({
        uri: photo.uri,
        base64: photo.base64,
        width: photo.width,
        height: photo.height,
      });
    }
  };
  const resetGame = () => {
    setPhotoData(null);
    setGame(game + 1);
    setRgb(null);
    setResult(undefined);
    setSubmitted(false);
  };

  const renderWebView = () => {
    if (!photoData) return null;

    const { base64, width, height } = photoData;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; }
        canvas { display: block; }
      </style>
    </head>
    <body>
      <canvas id="canvas"></canvas>
      <script>
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = "data:image/jpeg;base64,${base64}";
        img.onload = function () {
          const canvas = document.getElementById("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(this, 0, 0);

          try {
            const pixel = ctx.getImageData(${centerX}, ${centerY}, 1, 1).data;
            const rgb = {
              r: pixel[0],
              g: pixel[1],
              b: pixel[2]
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(rgb));
          } catch (err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ error: err.message }));
          }
        };
        img.onerror = function () {
          window.ReactNativeWebView.postMessage(JSON.stringify({ error: "Failed to load image" }));
        };
      </script>
    </body>
    </html>
  `;

    const screenHeight = Dimensions.get("window").height;

    return (
      <View style={{ flex: 1 }}>
        <WebView
          originWhitelist={["*"]}
          source={{ html }}
          javaScriptEnabled={true}
          automaticallyAdjustContentInsets={false}
          scalesPageToFit={true}
          style={{ height: screenHeight }}
          onMessage={(event) => {
            try {
              const result = JSON.parse(event.nativeEvent.data);
              if (result.error) {
                alert(`Error: ${result.error}`);
              } else {
                const { r, g, b } = result;
                setRgb({ r, g, b });
              }
            } catch (e) {
              alert("Failed to parse message from WebView");
            }
          }}
        />
      </View>
    );
  };

  const submitScore = async () => {
    try {
      if (!playerName || result === undefined) {
        alert("Please enter a name and ensure a score is available.");
        return;
      }

      const response = await axios.post(
        "https://colourleaderboard-lk72.onrender.com/api/leaderboard",
        {
          rone: targetRgb?.r,
          gone: targetRgb?.g,
          bone: targetRgb?.b,
          rtwo: rgb?.r,
          gtwo: rgb?.g,
          btwo: rgb?.b,
          player: playerName,
          score: result,
        }
      );
      Animated.timing(vanishAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setSubmitted(true);
        setPlayerName("");
      });
    } catch (error) {
      console.error("Failed to submit score", error);
      alert("Error submitting score");
    }
  };

  const renderCamera = () => {
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          autofocus="on"
          ref={cameraRef}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          <View
            style={[
              styles.centerCircle,
              {
                borderColor: `rgb(${targetRgb.r}, ${targetRgb.g}, ${targetRgb.b})`,
              },
            ]}
          />
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity onPress={TakePicture}>
              <Entypo name="camera" size={40} color="black" />
            </TouchableOpacity>
          </View>
          {targetRgb && (
            <View
              style={[
                styles.targetColour,
                {
                  backgroundColor: `rgb(${targetRgb.r}, ${targetRgb.g}, ${targetRgb.b})`,
                },
              ]}
            />
          )}
        </CameraView>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {result === undefined ? (
          photoData ? (
            renderWebView()
          ) : (
            renderCamera()
          )
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultText}>Match score: {result}%</Text>
            {!submitted && (
              <Animated.View style={styles.vanishContainer}>
                <Text style={styles.resultLabel}>Enter your name:</Text>
                <TextInput
                  value={playerName}
                  onChangeText={setPlayerName}
                  placeholder="Your name"
                  autoCapitalize="characters"
                  style={styles.input}
                />
                <TouchableOpacity onPress={submitScore}>
                  <Text style={styles.resultText}>Submit Score</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            <TouchableOpacity onPress={resetGame}>
              <Text style={styles.resultText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Leaderboard")}
            >
              <Text style={styles.resultText}>Leaderboard</Text>
            </TouchableOpacity>

            <Text style={styles.resultLabel}>Target Colour:</Text>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: `rgb(${targetRgb?.r}, ${targetRgb?.g}, ${targetRgb?.b})`,
                },
              ]}
            />

            <Text style={styles.resultLabel}>Your Guess:</Text>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: `rgb(${rgb?.r}, ${rgb?.g}, ${rgb?.b})`,
                },
              ]}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  bottomButtonContainer: {
    bottom: 40,
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 12,
    borderRadius: 12,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  inputContainer: {
    marginTop: 20,
    padding: 10,
    alignItems: "center",
  },
  input: {
    width: "100%",
    maxWidth: 300,
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    marginTop: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    fontFamily: "Typo",
  },
  backButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  centerCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 20,
    height: 20,
    marginLeft: -10,
    marginTop: -10,
    borderRadius: 10,
    borderWidth: 2,
    zIndex: 10,
  },
  targetColour: {
    position: "absolute",
    bottom: 30,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    zIndex: 10,
  },
  resultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Typo",
  },
  resultLabel: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: "Typo",
  },
  colorBox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
  },
  vanishContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
});
