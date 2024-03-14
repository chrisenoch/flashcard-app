export type ButtonContainer = {
  disabled: {
    isDisabled: Set<string>;
    isEnabled: Set<string>;
  };
  default: {
    useDefault: Set<string>;
    remove: Set<string>;
  };
  rounded: {
    sm: Set<string>;
    md: Set<string>;
    lg: Set<string>;
    full: Set<string>;
    default: Set<string>;
  };
  size: {
    sm: Set<string>;
    md: Set<string>;
    lg: Set<string>;
  };
  variant: {
    plain: Set<string>;
    primary: Set<string>;
    secondary: Set<string>;
    primaryOutlined: Set<string>;
    secondaryOutlined: Set<string>;
  };
} & {
  [key: string]: {
    [key: string]: Set<string>;
  };
};

export type ButtonTextContent = {
  size: {
    sm: Set<string>;
    md: Set<string>;
    lg: Set<string>;
  };
  variant: {
    plain: Set<string>;
    primary: Set<string>;
    secondary: Set<string>;
    primaryOutlined: Set<string>;
    secondaryOutlined: Set<string>;
  };
} & {
  [key: string]: {
    [key: string]: Set<string>;
  };
};

export type ButtonComponentMode = {
  container: ButtonContainer;
  textContent: ButtonTextContent;
};

export type ButtonComponent = {
  dark: ButtonComponentMode;
  light: ButtonComponentMode;
};
