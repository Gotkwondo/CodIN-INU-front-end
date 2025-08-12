import S_0 from './star_0.svg';
import S_0_25 from './star_0_25.svg';
import S_0_5 from './star_0_5.svg';
import S_0_75 from './star_0_75.svg';
import S_1 from './star_1.svg';

export const Stars: {
  [key: number]: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> | React.SVGProps<SVGElement>
  >;
} = {
  0: S_0,
  0.25: S_0_25,
  0.5: S_0_5,
  0.75: S_0_75,
  1: S_1,
};
