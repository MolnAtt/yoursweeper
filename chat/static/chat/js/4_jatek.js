// globális változók:
let egyik_palya = document.getElementById('egyik_palya');
let masik_palya = document.getElementById('masik_palya');
let aknaszam;
let jatekos_szotar;
let ki_vagy_te;
let username;
let map;


// függvények:

/**
 * globális változók inicializálása és a játék indítása
 */
async function init(){
    aknaszam = await get_aknaszam();
    jatekos_szotar = await melyik_jatekos_vagyok();
    ki_vagy_te = jatekos_szotar['melyik'];
    username = jatekos_szotar['username'];
    map = random_map_generalasa(aknaszam);

    if (ki_vagy_te=='masik'){
        valtozok_kuldese({
            'message': `${username} belépett a játékba, tehát indul a játék`,
            'jatek_allapot_update': MOST_MEGY,
        });
    } else if(ki_vagy_te=='egyik'){
        valtozok_kuldese({
            'message': `${username} létrehozta a játékot`,
            'jatek_allapot_update': MOST_MEGY,
        });
    }
    await interfesz_generalasa(); 
}

/**
 * Létrehoz egy 15x15-ös méretű mátrixot, amelyben véletlenszerűen vannak elszórva 1-esek (aknák) és 0-ák. 
 * @param {number} aknak_szama - az aknák száma
 * @returns {Array<Array<number>>} a 15x15-ös 0-1-mátrix
 */
function random_map_generalasa(aknak_szama){
    let lista = csupanullalista();
    lista_feltoltese_aknakkal(aknak_szama, lista);
    keveres(lista);
    return hajtogatas(lista);
}
/**
 * Az 225 hosszú számlistát behajtogatja egy 15x15-ös mátrixszá.
 * @param {Array<number>} egysoros - a lista (sorvektor)
 * @returns {Array<Array<number>>} - a mátrix
 */
function hajtogatas(egysoros){
    let index = 0;
    const matrix = []
    for (let i = 0; i < 15; i++) {
        const lista = []
        for (let j = 0; j < 15; j++) {
            lista.push(egysoros[index]);
            index++;
        }
        matrix.push(lista);
    }
    return matrix;
}
/**
 * Fisher-Yates-Knuth keverés, hogy bármely akna egyenlő valószínűséggel fordulhasson elő bárhol.
 * @param {Array} l - a lista, amit megkever
 */
function keveres(l){
    let i=l.length;
    while(i!=0){
        let j=Math.floor(Math.random()*i);
        i--;
        [l[i], l[j]] = [l[j], l[i]];
    }
}
/**
 * A lista első N elemét feltölti 1-esekkel
 * @param {number} N 
 * @param {Array<number>} lista 
 */
function lista_feltoltese_aknakkal(N, lista){
  for (let i = 0; i < N; i++) {
    lista[i] = 1;
  }
}
/**
 * csinál egy 225 db 0-ából álló listát
 * @returns {Array<number>} a lista
 */
function csupanullalista(){
    // return Array(225).fill(0);
    let a = [];
    for (let i = 0; i < 225; i++) {
        a[i] = 0;
    }
    return a;
}
/**
 * Létrehozza a kis kattintható diveket az egyik pályán, pl.: divek_letrehozasa(melyik, egyik_palya, 15, 15, aknaszam);
 * @param {string} username - játékos neve
 * @param {HTMLElement} palya - melyik pályáról van szó
 * @param {number} x - hány sor
 * @param {number} y - hány oszlop
 */
function divek_letrehozasa(username, palya, x, y){
    //     
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            let div = document.createElement("div");
            div.id = `${palya===egyik_palya ? 'egyik':'masik'}_${i}_${j}`;
            div.onclick = balkatt;
            div.oncontextmenu = jobbkatt;
            div.classList.add('nemkattintott');
            palya.appendChild(div);
        }
    }
}
/**
 * Egy (kattintott mező-)divről megmondja, hogy melyik is ez, mivel az id-be bele van égetve a koordináta és a pálya.
 * @param {HTMLElement} div 
 * @returns {Array} a div id-je robbantva egy string-number-number hármasba
 */
function melyikez(div){
    let [melyik, sx, sy] = div.id.split("_"); // pl.: ["egyik", "9", "4"]
    return [melyik, parseInt(sx), parseInt(sy)];
}
/**
 * a melyikez inverze: string-number-number alapján divet határoz meg.
 * @param {string} palya - a pálya neve
 * @param {number} x - sorindex
 * @param {number} y - oszlopindex
 * @returns 
 */
function ezadiv(palya, x, y){
    return document.getElementById(`${palya}_${x}_${y}`);
}
/**
 * A divre való kattintáskor zajlik az aknakereső logikája
 * @param {MouseEvent} e 
 */
function balkatt(e){
    switch (jatek_allapota) {
        case MEG_NEM_INDULT_EL:
            alert('még nem indult el a játék!');
            break;
        case MAR_NEM_MEGY_NYERTEL:
            alert('már nem megy a játék, mert nyertél.');
            break;
        case MAR_NEM_MEGY_VESZTETTEL:
            alert('már nem megy a játék, mert vesztettél');
            break;
        case MOST_MEGY:
            let mezodiv = e.target; // <div id="egyik_9_4"></div>
            console.log(mezodiv);

            
            // ha rákattintunk, akkor meg szeretném nézni, hogy mi van itt.
            // 1. kiderítjük az e.targetből, hogy hova kattintottunk : palya, x, y koordináta!
            
            // mezodiv.id // "egyik_9_4"
            const [melyik, x, y] = melyikez(mezodiv);
            
            console.log([melyik, x, y]);
            
            if (melyik!=ki_vagy_te){
                alert('saját pályádon kattintgassál');
            } else {
                cselekves = {
                    'kattintott_mezo_x': x,
                    'kattintott_mezo_y': y,
                    'felderitesek': [],
                }

                // 2. map-ban megnézzük, hogy van-e ott akna, és ha igen, bejelentjük a másiknak, aztán a saját játékosnak is.
                console.log(map[x][y]);
                if(map[x][y]===1){
                    cselekves['felderitesek'].push([x, y, -1]); // -1 jelenti azt, hogy benézte az aknával
                    vereseg();
                } else {      
                // 3. map-ban megnézzük, hogy van-e a szomszédban akna... 
                    const sz = szasz(x,y);
                    if(sz>0){
                        mezodiv.innerHTML=sz;
                        mezodiv.classList.remove('nemkattintott');
                        cselekves['felderitesek'].push([x, y, sz]);
                    } else {
                        // 4. Ha nincs sem itt sem a szomszédban akna, akkor gráfbejárás...
                        for (const [ux,uy] of ures_mezoi(x, y)) {
                            let d = ezadiv(ki_vagy_te, ux, uy)
                            d.innerHTML="";
                            d.classList.remove('nemkattintott');
                            cselekves['felderitesek'].push([ux, uy, 0]);
                            for (const [szx,szy] of szomszedai(ux, uy)) {
                                let d = ezadiv(ki_vagy_te, szx, szy)
                                const ssz = szasz(szx, szy)
                                d.innerHTML = ssz===0?'':ssz;
                                d.classList.remove('nemkattintott');
                                cselekves['felderitesek'].push([szx, szy, ssz]);
                            }
                        }
                    }
                }
                valtozok_kuldese(cselekves);
            }
    }
}

/**
 * üres mezők begyűjtése egy x,y cella körül a mátrixban. 
 * @param {number} x - sorindex
 * @param {number} y - oszlopindex
 * @returns {Array<Array<number>>} az üres mezők koordinátapárjainak listája
*/
function ures_mezoi(x,y){
    let result = [[x,y]]
    let tennivalok = [[x,y]]

    const feher = 0;
    const szurke = 1;
    const fekete = 2;

    let szinezes = random_map_generalasa(0); // nulla aknák 

    while(0<tennivalok.length){
        let [tx, ty] = tennivalok.pop();
        // feldolgozás

        szinezes[tx][ty] = fekete;

        // új szomszédok bevétele a tennivalókba

        for (const [szx,szy] of szomszedai(tx,ty)) {
            if (szinezes[szx][szy] === feher && szasz(szx,szy)===0){
                result.push([szx,szy]);
                tennivalok.push([szx, szy]);
            }
            szinezes[szx][szy] = szurke;
        }
    }
    return result;
}
/**
 * Egy adott koordinátájú pont szomszédainak listáját adja vissza. Erre azért van szükség, mert a sarokban, szélen, középen más mennyiségű szomszédja van egy elemnek. 
 * @param {number} x - sorindex
 * @param {number} y - oszlopindex
 * @returns {Array<Array<number>>} szomszédok listája
 */
function szomszedai(x,y){
   let lista = [];
    for (let i = x-1; i <= x+1; i++) {
        for (let j = y-1; j <= y+1; j++) {
            if(0<=i && 0<=j && i<15 && j<15){
                if(!(i===x && j === y))
                    lista.push([i,j])
            }
        }
    }
    return lista;
}
/**
 * A szomszédos aknák száma a mátrixban egy adott koordinátájú pont körül
 * @param {number} x - sorindex
 * @param {number} y - oszlopindex
 * @returns {number} a szomszédos aknák száma
 */
function szasz(x, y)
{
    let asz = 0;
    for (let i = x-1; i <= x+1; i++) {
        for (let j = y-1; j <= y+1; j++) {
            if(0<=i && 0<=j && i<15 && j<15){
                asz += map[i][j];
            }
        }
    }
    return asz-map[x][y];
}
/**
 * Bombát kiált itt. Vagy zászló kerül le, ha tényleg van itt bomba, vagy game over!
 * @param {MouseEvent} e 
 */
function jobbkatt(e){
    switch (jatek_allapota) {
        case MEG_NEM_INDULT_EL:
            alert('még nem indult el a játék!');
            break;
        case MAR_NEM_MEGY_NYERTEL:
            alert('már nem megy a játék, mert nyertél.');
            break;
        case MAR_NEM_MEGY_VESZTETTEL:
            alert('már nem megy a játék, mert vesztettél');
            break;
        case MOST_MEGY:
            let [melyik, x,y] = melyikez(e.target);
            if(melyik!=ki_vagy_te){
                alert('saját pályádon kattintgassál!');
            } else {
                e.preventDefault();
                if(map[x][y]!=1){
                    vereseg();
                } else {
                    e.target.innerHTML='⛳';
                    if(kesz_van_e()){
                        gyozelem();
                    }
                }
            }
    }
}
/**
 * Létrehozza a pályákat. Ha még vár a másik játékosra, akkor csak a sajátját generálja le.
 */
async function interfesz_generalasa(){
    let aknaszam = await get_aknaszam();


    console.log(`divek létrehozása ${aknaszam} aknával a(z) ${username} játékos részére, aki a(z) "${ki_vagy_te}".`);
    divek_letrehozasa(username, egyik_palya, 15, 15); // A játékot indító játékos pályája mindig legyen legenerálva!
    if (ki_vagy_te == 'masik') {
        divek_letrehozasa(username, masik_palya, 15, 15);   
    }
}

/**
 * Eldönti, hogy készen van-e a játékos. Megszámolja a zászlók számát, és ha annyi, amennyi kell, akkor true, egyébként false.
 * @returns {boolean} készen van-e a játékos
 */
function kesz_van_e(){
    let db = 0;
    for (const div of egyik_palya.children) {
        if(div.innerHTML==='⛳'){
            db++;
        }
    }
    return db == aknaszam;
}
/**
 * Bejelenti a vereséget a másik játékosnak.
 */
function vereseg_bejelentese(){
    valtozok_kuldese({
        'message': `Szegény ${username} elvesztette a játékot.`,
        'jatek_allapot_update':MAR_NEM_MEGY_NYERTEL,
    });
}

/**
 * Bejelenti a győzelmet a másik játékosnak.
 */
function gyozelem_bejelentese(){
    valtozok_kuldese({
        'message': `Gratulálunk! ${username} megnyerte a játékot.`,
        'jatek_allapot_update':MAR_NEM_MEGY_VESZTETTEL,
    });
}
/**
 * Beállítja játékot megnyertre és teszi a dolgokat.
 */
function gyozelem(){
    jatek_allapota = MAR_NEM_MEGY_NYERTEL;
    alert('Gratulálok, győztél!');
}
/**
 * beállítja a játékot elvesztettre és teszi a kötelezőket.
 */
function vereseg(){
    vereseg_bejelentese();
    jatek_allapota = MAR_NEM_MEGY_VESZTETTEL;
    alert('you died');
}

///////////////////////////////// FŐPROGRAM ////////////////////////////////

init();                 // async!
