import React, { useRef, useEffect } from "react";
import { View, Animated } from "react-native";
import { Colors } from "@/constants/theme";

const AnimatedBar = ({ isRecording }) => {
  const height = useRef(new Animated.Value(10)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      const animate = () => {
        animationRef.current = Animated.sequence([
          Animated.timing(height, {
            toValue: Math.random() * 50 + 20,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(height, {
            toValue: 10,
            duration: 200,
            useNativeDriver: false,
          }),
        ]);

        animationRef.current.start(({ finished }) => {
          if (finished && isRecording) {
            animate();
          }
        });
      };

      animate();
    } else {
      animationRef.current?.stop();
      height.setValue(10);
    }

    return () => {
      animationRef.current?.stop();
    };
  }, [isRecording]);

  return (
    <Animated.View
      style={{
        width: 4,
        height,
        backgroundColor: Colors.principal,
        marginHorizontal: 2,
        borderRadius: 2,
      }}
    />
  );
};

export default function FakeWave({ isRecording }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        width: "100%",
      }}
    >
      {Array.from({ length: 48 }).map((_, i) => (
        <AnimatedBar key={i} isRecording={isRecording} />
      ))}
    </View>
  );
}