import { selectType } from '@/app/(auth-required)/main/info/course-reviews/write-review/type';
import { useReducer } from 'react';

type ActionType = {
  type: string;
  payload: selectType;
}

type initialStateType = {
  [key: string] : selectType
  // lecture?: selectType;
  // grade?: selectType;
  // semester?: selectType;
}
const reducer = (state: initialStateType, action: ActionType): initialStateType => {
  // switch (action.type) {
  //   case "lecture":
  //     return { ...state, lecture: action.payload };
  //   case "grade":
  //     return { ...state, grade: action.payload };
  //   case "semester":
  //     return { ...state, semester: action.payload };
  //   default:
  //     console.error('옳바른 action type이 아닙니다.');
  //     return state;
  // }
  if (action.type in state) {
    return { ...state, [action.type]: action.payload };
  } else {
    console.error('옳바른 action type이 아닙니다.');
    return state;
  }
};

const useSelectReducer = (initialState: initialStateType = {}) => {
  const [selectedState, selectedStateDispatch] = useReducer(
    reducer,
    initialState
  );
  return [selectedState, selectedStateDispatch] as const;
};

export { useSelectReducer };