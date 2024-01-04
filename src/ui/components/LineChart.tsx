import {useMemo, useState} from 'react';
import {Dimensions, LayoutRectangle, View} from 'react-native';
import {LineChart as NativeLineChart} from 'react-native-chart-kit';
import {tw} from 'velo-x/theme';

export function LineChart({height, data}: Props) {
  const [width, setWidth] = useState(0);

  const chartLabelFormatter = (value: string) => {
    const index = data.findIndex(d => d.x === value);
    return index % 10 === 4 ? value : '';
  };

  return (
    <View onLayout={({nativeEvent}) => setWidth(nativeEvent.layout.width)}>
      <NativeLineChart
        data={{
          labels: data.map(d => d.x),
          datasets: [
            {
              data: data.map(d => d.y),
              strokeWidth: 2,
            },
          ],
        }}
        hidePointsAtIndex={
          data
            .map((d, i) => (i % 10 !== 4 ? i : null))
            .filter(v => v != null) as number[]
        }
        formatXLabel={chartLabelFormatter}
        width={width}
        height={height}
        yAxisSuffix=" km/h"
        chartConfig={{
          backgroundGradientFrom: tw.color('gray-800'),
          backgroundGradientTo: tw.color('gray-900'),
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(244, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withHorizontalLines={true}
        withVerticalLines={false}
      />
    </View>
  );
}
interface Props {
  height: number;
  data: {
    y: number;
    x: string;
  }[];
}
