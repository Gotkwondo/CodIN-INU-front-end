import { ComponentProps } from 'react';

type RateBarType = {
  score: number;
} & ComponentProps<'div'>;

const generateBars = (coloredBarCnt: number) => {
  const bars = [];
  for (let i = 0; i < 20; i++) {
    if (coloredBarCnt > i) {
      bars.push(
        <div
          key={`coloredBar_${i}`}
          className="w-2 h-7 mr-1 bg-[#0D99FF]"
        />
      );
    } else {
      bars.push(
        <div
          key={`grayBar_${i}`}
          className="w-2 h-7 mr-1 bg-[#EBF0F7]"
        />
      );
    }
  }
  return bars;
};

const RateBar = ({score, className = ''}: RateBarType) => {
  const coloredBarCnt = score / 0.25;
  const barAry = generateBars(coloredBarCnt);
  return (
    <div className={`flex content-center ${className}`}>
      {
        barAry.map(bar => {
          return bar
        })
      }
    </div>
  );
}

export { RateBar };