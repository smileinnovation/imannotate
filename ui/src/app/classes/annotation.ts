import { BoundingBox  } from './boundingbox';

export class Annotation {
  image = "";
  boxes = new Array<BoundingBox>();
}
