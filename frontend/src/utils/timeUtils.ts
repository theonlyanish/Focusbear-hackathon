export const formatTime = (time: Date | number): string => {
  // Implement your time formatting logic here
  return new Date(time).toLocaleString();
};
