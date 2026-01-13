import Character from "../classes/Character";
import utils from "../shared/utils"

/**
 * calculates a fight between 2 characters and updates their stats if needs be
 * @param c1 Character 1
 * @param c2 Character 2
 * @returns 
 *          0 if it's a draw (equal strength or no looser after a number of turns)
 *          1 if c1 wins
 *          2 if c2 wins 
 */
const fight = (c1: Character, c2: Character): number => {
    let c1Attack = utils.sumProp(c1, 'attack');
    let c2Attack = utils.sumProp(c2, 'attack');
    let c1Defense = utils.sumProp(c1, 'defense');
    let c2Defense = utils.sumProp(c2, 'defense');
    // if they have the same attack and defense, nothing will happen, it's a draw
    if((c1Attack > 0 && c1Attack === c2Defense) || (c2Attack > 0 && c1Defense === c2Attack))
        return 0;
    let done: boolean = false;

    // to decide who attacks first, we check who has the greatest speed, if equality, the attacker starts
    let c1First = utils.sumProp(c1, "attackSpeed") >= utils.sumProp(c2, "attackSpeed");
    while(!done){
        // the fastest attacker hits
        if(c1First)
            c2.currentHP -= c1Attack - c2Defense < 0 ? 0 : c1Attack - c2Defense;
        else
            c1.currentHP -= c2Attack - c1Defense < 0 ? 0 : c2Attack - c1Defense;

        // if someone's HP is 0 or less, the fight is over and we have a winner
        if(c2.currentHP <= 0 || c1.currentHP <= 0)
            done = true;
        else {
            // the fight is not finished, the slower attacker hits
            if(c1First)
                c1.currentHP -= c2Attack - c1Defense < 0 ? 0 : c2Attack - c1Defense;
            else
                c2.currentHP -= c1Attack - c2Defense < 0 ? 0 : c1Attack - c2Defense;
        }
        // if someone's HP is 0 or less, the fight is over and we have a winner
        if(c2.currentHP <= 0 || c1.currentHP <= 0)
            done = true;
    }

    // we determine the winner by who has HP left
    return c1.currentHP == c2.currentHP ? 0 : 
            c1.currentHP > c2.currentHP ? 1 : 2;
}

const _ = {
    fight
}

export default _;