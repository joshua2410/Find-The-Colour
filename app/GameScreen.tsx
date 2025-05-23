import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { WebView } from "react-native-webview";
import { Dimensions } from "react-native";

export default function GameScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoData, setPhotoData] = useState<{
    uri: string;
    base64: string;
    width: number;
    height: number;
  } | null>(null);
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number } | null>(
    null
  );

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

  const renderPicture = () => {
    return (
      <View>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
        <Button onPress={() => setUri(null)} title="Take another picture" />
      </View>
    );
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
                alert(`Center Pixel RGB:\nR=${r}, G=${g}, B=${b}`);
              }
            } catch (e) {
              alert("Failed to parse message from WebView");
            }
          }}
        />
        <Button
          title="Take Another Picture"
          onPress={() => setPhotoData(null)}
        />
      </View>
    );
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
          <View style={styles.buttonContainer}>
            <Button
              onPress={TakePicture}
              style={styles.button}
              title="takePicture"
            ></Button>
          </View>
        </CameraView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {photoData ? renderWebView() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
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
});
