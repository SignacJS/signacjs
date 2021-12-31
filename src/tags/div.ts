import { AllStyle, BaseStyle } from "../styles/types";

import { Element, ElementProps } from "../abstract/Element";

type DivStyle = Pick<AllStyle, "overflowX" | "overflowY"> & BaseStyle;

export interface DivProps extends ElementProps {
  styling: Partial<DivStyle>;
}

class Div extends Element {}

export default Div;
