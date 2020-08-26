const lowPercent: number = 30;
const mediumPercent: number = 70;

export const customColors = (percentage: number): string => {
  if (percentage < lowPercent) {
    return '#9f7aea'; // Purple-500
  } else if (percentage < mediumPercent) {
    return '#805ad5'; // Purple-600
  } else {
    return '#50248f'; // primary-purple-4
  }
};
