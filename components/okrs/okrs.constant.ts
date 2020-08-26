export const customColors = (percentage: number): String => {
  if (percentage < 30) {
    return '#9f7aea'; // Purple-500
  } else if (percentage < 70) {
    return '#805ad5'; // Purple-600
  } else {
    return '#50248f'; // primary-purple-4
  }
};
