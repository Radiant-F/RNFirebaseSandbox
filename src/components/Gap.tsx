import {DimensionValue, StatusBar, View} from 'react-native';

export default function Gap({
  width,
  height,
  statusBarGap,
  flex,
}: {
  width?: DimensionValue | undefined;
  height?: DimensionValue | undefined;
  statusBarGap?: boolean;
  flex?: number | undefined;
}) {
  const StatusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

  if (statusBarGap) return <View style={{height: StatusBarHeight}} />;
  else return <View style={{width, height, flex}} />;
}
