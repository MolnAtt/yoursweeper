const chatlog = document.getElementById('chatlog');
const szoveginput = document.getElementById('szoveginput');
const kuldgomb = document.getElementById('kuldgomb');

/**
 * Ha entert nyomtak, lenyomja a küld gombot
 * @param {KeyboardEvent} e 
 */
function billentyunyomasvizsgalat(e) {
    if (e.key === 'Enter') {
        kuldgomb.click();
    }
};

/**
 * Ha lenyomják a küld gombot, megy a websocketen keresztül az üzenet
 * @param {MouseEvent} e 
 */
function uzenet_klikk(e) {
    valtozok_kuldese({'message': `${username}: ${szoveginput.value}`});
    szoveginput.value = '';
}

szoveginput.focus();
szoveginput.addEventListener('keyup', billentyunyomasvizsgalat);

kuldgomb.addEventListener('click', uzenet_klikk);
