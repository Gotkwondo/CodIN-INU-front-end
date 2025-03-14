const calcEmotion = (rating: number) => {
  if (rating <= 1.5) {
    return '힘들어요';
  } else if (rating <= 3.5) {
    return '괜찬아요';
  } else return '좋아요';
};

export { calcEmotion };