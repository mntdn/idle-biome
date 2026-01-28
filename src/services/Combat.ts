import Character from "../classes/Character";

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
    let c1Attack = c1.getTotal('attack');
    let c2Attack = c2.getTotal('attack');
    let c1Defense = c1.getTotal('defense');
    let c2Defense = c2.getTotal('defense');
    // if they have the same attack and defense, nothing will happen, it's a draw
    if((c1Attack > 0 && c1Attack === c2Defense) || (c2Attack > 0 && c1Defense === c2Attack))
        return 0;
    let done: boolean = false;

    // to decide who attacks first, we check who has the greatest speed, if equality, the attacker starts
    let c1First = c1.getTotal("attackSpeed") >= c2.getTotal("attackSpeed");
    while(!done){
        // the fastest attacker hits
        if(c1First)
            c2.props!.currentHP! -= c1Attack - c2Defense < 0 ? 0 : c1Attack - c2Defense;
        else
            c1.props!.currentHP! -= c2Attack - c1Defense < 0 ? 0 : c2Attack - c1Defense;

        // if someone's HP is 0 or less, the fight is over and we have a winner
        if(c2.props!.currentHP! <= 0 || c1.props!.currentHP! <= 0)
            done = true;
        else {
            // the fight is not finished, the slower attacker hits
            if(c1First)
                c1.props!.currentHP! -= c2Attack - c1Defense < 0 ? 0 : c2Attack - c1Defense;
            else
                c2.props!.currentHP! -= c1Attack - c2Defense < 0 ? 0 : c1Attack - c2Defense;
        }
        // if someone's HP is 0 or less, the fight is over and we have a winner
        if(c2.props!.currentHP! <= 0 || c1.props!.currentHP! <= 0)
            done = true;
    }

    // we determine the winner by who has HP left
    return c1.props!.currentHP! == c2.props!.currentHP! ? 0 : 
            c1.props!.currentHP! > c2.props!.currentHP! ? 1 : 2;
}

const _ = {
    fight
}

export default _;