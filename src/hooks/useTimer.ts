import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { tickTimer, stopTimer } from '../store/interviewSlice';

export function useTimer() {
  const dispatch = useDispatch();
  const { currentTimer, isTimerActive } = useSelector((state: RootState) => state.interview);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && currentTimer > 0) {
      interval = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    } else if (currentTimer === 0 && isTimerActive) {
      dispatch(stopTimer());
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, currentTimer, dispatch]);

  return { currentTimer, isTimerActive };
}