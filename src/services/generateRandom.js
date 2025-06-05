export const generateRandom = (str) => {
    const dummy ='0123456789'

    let result = '';
    for (let i = 0; i < str; i++) {
        const randomIndex = Math.floor(Math.random() * dummy.length);
        result += dummy[randomIndex];
    }
    return result;
}