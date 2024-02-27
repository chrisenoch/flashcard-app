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
