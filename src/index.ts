import MarkovCoil from "./MarkovCoil"
import { tokenize } from "./tokenize"
const tokens = tokenize("the quick fox and the quick dog fox");
const markov = new MarkovCoil(tokens);

markov.prettyPrint();

