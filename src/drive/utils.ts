import {AllSpeeds} from './types';

const timeInterval = 100;

export function linearInterpolation(
  allSpeeds: AllSpeeds,
  targetSpeed: number,
): AllSpeeds {
  let targetInserted = false;
  const data = Object.values(allSpeeds);
  const result: typeof data = [];

  const speedMap = new Map<number, (typeof data)[0]>();

  for (let i = 0; i < data.length; i++) {
    const currentData = data[i];

    // If speed already exists in the map and current data is later, update the map entry
    if (speedMap.has(currentData.speed)) {
      const existingData = speedMap.get(currentData.speed)!;
      if (
        new Date(currentData.date).getTime() >
        new Date(existingData.date).getTime()
      ) {
        speedMap.set(currentData.speed, currentData);
      }
    } else {
      speedMap.set(currentData.speed, currentData);
    }
  }

  // Sort the unique data points by date
  const uniqueData = Array.from(speedMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  for (let i = 0; i < uniqueData.length - 1; i++) {
    const currentData = uniqueData[i];
    const nextData = uniqueData[i + 1];

    const currentDate = new Date(currentData.date).getTime();
    const nextDate = new Date(nextData.date).getTime();

    const deltaTime = nextDate - currentDate;
    const steps = Math.ceil(deltaTime / timeInterval);

    for (let j = 0; j <= steps; j++) {
      const interpolatedDate = currentDate + (j * deltaTime) / steps;
      const interpolatedSpeed =
        currentData.speed + (j / steps) * (nextData.speed - currentData.speed);

      if (interpolatedSpeed === targetSpeed) {
        targetInserted = true;
      }

      result.push({
        ...currentData,
        date: new Date(interpolatedDate),
        speed: interpolatedSpeed,
      });
    }
  }

  // Add the last recorded point
  result.push({
    ...uniqueData[uniqueData.length - 1],
  });

  if (!targetInserted) {
    for (let i = 1; i < result.length; i++) {
      const prevData = result[i - 1];
      const currentData = result[i];

      if (prevData.speed <= targetSpeed && currentData.speed >= targetSpeed) {
        const interpolatedDate =
          (new Date(prevData.date).getTime() +
            new Date(currentData.date).getTime()) /
          2;
        result.splice(i, 0, {
          date: new Date(interpolatedDate),
          lat: (prevData.lat + currentData.lat) / 2,
          lng: (prevData.lng + currentData.lng) / 2,
          speed: targetSpeed,
        });
        targetInserted = true;
        break;
      }
    }
  }

  const all = result
    .filter(v => v.speed <= targetSpeed)
    .reduce((acc, c) => {
      acc[c.date.getTime()] = c;

      return acc;
    }, {} as AllSpeeds);
  console.log({all});
  return all;
}
