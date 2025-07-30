import { MarkovCoil } from "../src/index";
import { readFileSync, writeFileSync, statSync } from "fs";

const file = readFileSync("./benchmark/shakespeare.txt", "utf-8");
const tokens = file.replace(/\s+/g, " ").trim().toLowerCase().split(" ");

const benchmarkSizes = [1000, 10000, 100000, 1000000];
benchmarkSizes.forEach((size) => {
  const benchmarkTokens = tokens.slice(0, size);
  const startTime = Date.now();
  const markov = new MarkovCoil(benchmarkTokens);
  const endTime = Date.now();
  writeFileSync("./benchmark/data", markov.serialize());
  const fileStats = statSync("./benchmark/data");

  const result = {
    tokens: benchmarkTokens.length,
    memory: fileStats.size,
    time: endTime - startTime,
  };

  console.log("===");
  console.log(`${result.tokens} Tokens`);
  console.log(`Memory: ${result.memory} bytes`);
  console.log(`Compute time: ${result.time}ms`);
});
