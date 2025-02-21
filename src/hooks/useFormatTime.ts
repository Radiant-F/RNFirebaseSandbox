import {useMemo} from 'react';

/**
 * A custom React hook to format a time in milliseconds to hh:mm:ss, mm:ss, or ss format.
 * @param {number} timeMs - Time in milliseconds.
 * @returns {string} - The formatted time as a string.
 */
function useFormatTime(timeMs: number): string {
  const formattedTime = useMemo(() => {
    if (isNaN(timeMs) || timeMs < 0) return '0';

    // Convert milliseconds to total seconds
    const totalSeconds = Math.floor(timeMs / 1000);

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      // Format to hh:mm:ss
      return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
      ].join(':');
    } else if (minutes > 0) {
      // Format to mm:ss
      return [
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
      ].join(':');
    } else {
      // Format to ss
      return seconds.toString();
    }
  }, [timeMs]);

  return formattedTime;
}

export default useFormatTime;
