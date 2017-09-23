export function removeElement(array, element) {
    const index = array.indexOf(element);
    if(index != -1) {
        return array.splice(index, 1)[0];
    } else {
        return null;
    }
}