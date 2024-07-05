// noinspection JSCheckFunctionSignatures

import { createContext, useContext, useReducer } from "react";

const initialState = {
  timers: {},
};

const initialTimerState = {
  timerStarted: false,
  timerPaused: false,
  timer: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "START_TIMER": {
      const { key } = action.payload;
      return {
        timers: {
          ...state.timers,
          [key]: {
            ...initialTimerState,
            timerStarted: true,
          },
        },
      };
    }
    case "UPDATE_TIMER": {
      const { key, timer } = action.payload;
      return {
        timers: {
          ...state.timers,
          [key]: {
            ...state.timers[key],
            timer,
          },
        },
      };
    }
    case "PAUSE_TIMER": {
      const { key } = action.payload;
      return {
        timers: {
          ...state.timers,
          [key]: {
            ...state.timers[key],
            timerPaused: true,
          },
        },
      };
    }
    case "RESUME_TIMER": {
      const { key } = action.payload;
      return {
        timers: {
          ...state.timers,
          [key]: {
            ...state.timers[key],
            timerPaused: false,
          },
        },
      };
    }
    case "STOP_TIMER": {
      const { key } = action.payload;
      return {
        timers: {
          ...state.timers,
          [key]: initialTimerState,
        },
      };
    }
    case "STOP_ALL_TIMERS":
      return {
        timers: {},
      };
    default:
      return state;
  }
};

export const TimerContext = createContext({
  timerState: initialState,
  startTimer: (_key) => {},
  updateTimer: (_key, _timer) => {},
  pauseTimer: (_key) => {},
  resumeTimer: (_key) => {},
  stopTimer: (_key) => {},
  stopAllTimers: () => {},
});

export const TimerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  const actions = {
    startTimer: (key) => dispatch({ type: "START_TIMER", payload: { key } }),
    updateTimer: (key, timer) =>
      dispatch({ type: "UPDATE_TIMER", payload: { key, timer } }),
    pauseTimer: (key) => dispatch({ type: "PAUSE_TIMER", payload: { key } }),
    resumeTimer: (key) => dispatch({ type: "RESUME_TIMER", payload: { key } }),
    stopTimer: (key) => dispatch({ type: "STOP_TIMER", payload: { key } }),
    stopAllTimers: () => dispatch({ type: "STOP_ALL_TIMERS" }),
  };

  const timerContext = {
    timerState: state,
    ...actions,
  };

  return (
    <TimerContext.Provider value={timerContext}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }
  return context;
};
