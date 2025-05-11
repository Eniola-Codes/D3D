import { StaticImageData } from 'next/image';
import {
  abc,
  aljazeera,
  bbc,
  cbc,
  cnews,
  cnn,
  comcast,
  finantial_times,
  forbes,
  fox,
  independent,
  nbc,
  reuters,
  skynews,
  the_sun,
  the_times,
  time,
} from '../../../public/assets/logo';

interface LogoItem {
  item: StaticImageData;
}

export const Logos: LogoItem[] = [
  { item: abc },
  { item: aljazeera },
  { item: bbc },
  { item: cbc },
  { item: cnews },
  { item: cnn },
  { item: comcast },
  { item: finantial_times },
  { item: forbes },
  { item: fox },
  { item: independent },
  { item: nbc },
  { item: reuters },
  { item: skynews },
  { item: the_sun },
  { item: the_times },
  { item: time },
];
