# Markov Coil

Markov chain implementation in TypeScript, optimized for providing text prediction
from large bodies of text.

## Features

- Token-based trie and vocabulary indexing for fast queries and small memory footprint
- Set depth of chain for required length of token n-gram
- Predict tokens or token sequences with or without weighted choice
- Get probabilities for all possible predictions
- Compressed JSON serialization

## Installation

```bash
npm install markov-coil
```

## Usage

### Initialize

```javascript
import { MarkovCoil } from "markov-coil";

const tokens = "the quick brown fox jumps over the lazy dog".split(" ");
const markov = new MarkovCoil(tokens);
```

### Prediction

#### Single Tokens

```javascript
markov.predict(["the", "quick", "brown"]); // => 'fox'
markov.predict(["the"]); // => weighted random choice between 'quick' or 'lazy' (equal in this case)
markov.predict(["token_not_found"]); // => weighted random choice between all tokens

// With 'weighted' flag set to false, all predictions for sequence are equally likely
markov.predict(["the"], false); // => 'quick' or 'lazy', with equal probability of being chosen
```

#### Sequences

```javascript
markov.predictSequence(["the", "quick", "brown"], 3); // => ['fox', 'jumps', 'over']
```

#### Probability Mapping

```javascript
markov.predictions(["the"]); // => { 'quick': 0.5, 'lazy': 0.5 }
```

### Serialization

```javascript
import { serialize, deserialize } from "markov-coil";

const jsonString = serialize(markov);
const decodedMarkov = deserialize(data);
```

## Contributing

Pull requests are welcome. For major changes, open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
