//This allows us to use typed values for SimpleChanges in ngOnChanges. See accordion.component.ts for an example.
export function getKeysAsValues(objectToTransform: { [key: string]: any }) {
  const fields: any = {};
  Object.keys(objectToTransform).forEach((key) => {
    fields[key] = key;
  });
  return fields;
}

export type PropertyNamesAsStrings<Type> = {
  [Property in keyof Type as Property]: Property;
};

//Usage in class:
// const { ...typeToAssign } = this;
// this.fields = initFieldsTwo<typeof typeToAssign>(this);
export function initFieldsNoSetters<T>(self: T) {
  return getKeysAsValues(self!) as PropertyNamesAsStrings<typeof self>;
}

export function initFields<T>(self: T, component: any) {
  const objWithEnumerableKeysAsValues = getKeysAsValues(self!);
  const prototypeProps = Object.getOwnPropertyNames(component['prototype']);
  const objWithPrototypeKeysAsValues: any = {};
  prototypeProps.forEach((key) => {
    objWithPrototypeKeysAsValues[key] = key;
  });
  const combinedObj = {
    ...objWithEnumerableKeysAsValues,
    ...objWithPrototypeKeysAsValues,
  };
  return combinedObj as PropertyNamesAsStrings<typeof self>;
}
