import { View, Text } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import { animated, useSpring } from "@react-spring/web";
import "./index.css";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const springs = useSpring({
    from: { x: 0 },
    to: { x: 200 },
    config: {
      duration: 10000,
    },
  });

  return (
    <View className="index">
      <animated.div
        style={{ background: "red", width: 100, height: 100, ...springs }}
      >
        hi
      </animated.div>
    </View>
  );
}
