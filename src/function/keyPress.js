const keys = [37, 39, 38, 40]
export default function keyPress(key){
    if(keys.includes(key)){
        return {
            key: keys.indexOf(key),
            isValid: true
        };
    }else{
        return { isValid: false };
    }
}