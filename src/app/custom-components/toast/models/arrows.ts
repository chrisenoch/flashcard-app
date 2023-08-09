//Used StackOverflow to come up with my own, modified, solution. https://stackoverflow.com/questions/56068854/forcing-array-to-have-at-least-one-value-in-typescript

export type ArrowPosition = 'NONE' | 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';

//An array of type ArrowPosition with at least one value
export type Arrows = [ArrowPosition, ...ArrowPosition[]];

//Reason for the uncommon Arrows type:

//The user can define an object like the one below to decide the next destinations for the Toast
//We don't want the user to define an empty array for "arrows" because this is ambiguous. Should toast.component.ts autoDefineArrow# be called (and thus automatically define
//the arrow based on the POSITION property) or should there be no arrow at all added to the toast? It is not clear if the array is empty. Consequently, the user is forced to either
//omit the arrows property or to define the arrows property with an array that contains at least one ArrowPosition value. If "NONE" is included, this overrides all other values
// in the array and no arrow is added to the Toast.

//Example of how to define nextElements:
// nextElements: {
//   id: string;
//   position: Position;
//   arrows?: Arrows;
// }[] = [
//   { id: 'toast-destination-2', position: 'RIGHT' },
//   { id: 'toast-destination-3', position: 'TOP', arrows: ['TOP', 'BOTTOM'] },
// ];
