//Used StackOverflow to come up with my own, modified, solution. https://stackoverflow.com/questions/56068854/forcing-array-to-have-at-least-one-value-in-typescript

export type ArrowPosition = 'NONE' | 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';

//An array of type ArrowPosition with at least one value
export type Arrows = [ArrowPosition, ...ArrowPosition[]];

//Reason for the uncommon Arrows type:

//We don't want the user to define an empty array for "arrows" because this is ambiguous.
//Should the arrow be automatically detrmined  based on the POSITION property) or should there
//be no arrow at all? It is not clear if the array is empty. Consequently, the user is forced to either
//omit the arrows property or to define the arrows property with an array that contains at least one ArrowPosition value.
// If "NONE" is included, it should override all other values in the array and no arrow arrow should be defined. (See tour-guide.component.ts)
