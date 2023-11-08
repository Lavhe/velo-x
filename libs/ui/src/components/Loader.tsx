import { ActivityIndicator } from "react-native";
import { tw } from "theme";

const ClassNames = {
  FullscreenLoader: tw`h-screen w-screen my-auto`,
};

export function Loader({ isFullscreen }: LoaderProps) {
  if (isFullscreen) {
    return (
      <ActivityIndicator
        style={ClassNames.FullscreenLoader}
        size="large"
        color="primary"
        accessibilityHint="loading"
      />
    );
  }

  return (
    <ActivityIndicator
      accessibilityHint="loading"
      size="large"
      color="primary"
    />
  );
}
interface LoaderProps {
  isFullscreen?: boolean;
}
