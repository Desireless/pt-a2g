// Recibe timestamp en UTC
export const getMinutesDifferenceFromNow = (timestamp: string): number => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    return minutes;
}
  