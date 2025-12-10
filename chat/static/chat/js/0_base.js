/**
 * Visszaadja egy lista utolsó előtti elemét.
 * @param {Array} lista 
 * @returns {any} a lista utolsó előtti eleme
 */
function utolso_elotti_eleme(lista){
    return lista[lista.length-2];
}
/**
 * Az URL-ből kiolvassa a játék ID-ját.
 * @returns {number}
 */
function get_jatekid(){
    return parseInt(utolso_elotti_eleme(window.location.pathname.split('/')));
}

/**
 * megmondja a megadott játékos ellenfelét.
 * @param {string} jatekos 
 * @returns {string} a játékos ellenfele
 */
function ellenfele(jatekos){
    return (jatekos==='egyik')? 'masik': 'egyik';
}

const MEG_NEM_INDULT_EL = 0;
const MOST_MEGY = 1;
const MAR_NEM_MEGY_VESZTETTEL = 2;
const MAR_NEM_MEGY_NYERTEL = 3;
let jatek_allapota = MEG_NEM_INDULT_EL; 