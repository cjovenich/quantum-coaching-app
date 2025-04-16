const initialState = {
    ...,
    emotionCalendar: {},  // ← new
  };
  
  case 'SET_EMOTION_CALENDAR': return { ...state, emotionCalendar: action.payload };
  