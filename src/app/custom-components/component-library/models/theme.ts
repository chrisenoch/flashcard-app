export type DisabledState = 'isDisabled' | 'isEnabled';
export type CSSClassesStringsByHTMLLevel = { [key: string]: string };
export type CSSChanges = {
  add?: string | string[];
  remove?: string | string[];
};
export type CSSChangesByHTMLLevel = {
  [key: string]: {
    add?: string | string[];
    remove?: string | string[];
  };
};
export type Component = {
  [key: string]: {
    //light
    [key: string]: {
      //container
      [key: string]: {
        //variant
        [key: string]: Set<string>;
      };
    };
  };
};

export type CSSClassesByHTMLLevel = {
  [key: string]: Set<string>;
};

export type HTMLLevel = { [key: string]: { [key: string]: Set<string> } };

export type CSSPropsByHTMLLevel = {
  [key: string]: {
    [key: string]: string;
  };
};
