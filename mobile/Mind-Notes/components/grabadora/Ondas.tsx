import React, { useRef, useEffect } from "react";
import { View, Animated } from "react-native";
import { Colors } from "@/constants/theme";

const AnimatedBar = ({ value, index}) => {
  const height = useRef(new Animated.Value(10)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    const normalized = Math.max(10, (value + 160) * 0.4);
    const variance = 0.7 + (index % 5) * 0.1;

      Animated.timing(height, {
        toValue: normalized * variance,
        duration: 80,
        useNativeDriver: false,
        }).start();
      }, [value]);
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

export default function FakeWave({ levels = [] }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        width: "90%",
      }}
    >
      {levels.map((lvl, i) => (
        <AnimatedBar key={i} value={lvl} index={i} />
      ))}
    </View>
  );
}