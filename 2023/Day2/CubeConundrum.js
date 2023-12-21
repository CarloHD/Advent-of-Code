/*
As you walk, the Elf shows you a small bag and some cubes which are either red, green, or blue. Each time you play this game, he will hide a secret number of cubes of each color in the bag, and your goal is to figure out information about the number of cubes.

To get information, once a bag has been loaded with cubes, the Elf will reach into the bag, grab a handful of random cubes, show them to you, and then put them back in the bag. He'll do this a few times per game.

You play several games and record the information from each game (your puzzle input). Each game is listed with its ID number (like the 11 in Game 11: ...) followed by a semicolon-separated list of subsets of cubes that were revealed from the bag (like 3 red, 5 green, 4 blue).


c'è una borsa piena di dadi
i dadi sono di colore o rosso o verde o blu.

il sacchetto è stato riempito con 
  12 cubi rossi, 
  13 cubi verdi,  
  14 cubi blu

ogni sessione di gioco ha un ID NUMERICO
ogni sessione contiene più estrazioni dal sacchetto divise da ";"
ogni estrazione tira fuori un numero casuali di dadi (anche più di quelli disponibili)

possiamo considerare valide solo le sessioni le quali somme di estrazioni non superano il numero di dadi disponibili

obiettivo sommare gli ID di solo le sessioni di gioco valide

*/
/**
 * @type {{id:string, extractions:{'red':number,'blue':number,'green':number}[][]}[]}
 */
const input = require('./input.js').inputStructured

const maxNumRedCubesValid = 12
const maxNumGreenCubesValid = 13
const maxNumBlueCubesValid = 14

/**
 * @type {{id:string, red:number, blue:number,green:number}[]}
 */
const numCubesPerExtract = []

//per ogni sessione di gioco,
input.forEach((session, index) => {
  let totalRedCubes = 0
  let totalGreenCubes = 0
  let totalBlueCubes = 0

  // per ogni estrazione sto verificando qual'è
  // il numero massimo di dadi inseriti nella borsa
  session.extractions.forEach(extraction => {
    // per ogni estrazione salvo il numero più alto di dadi del rispettivo colore
    extraction.forEach(cubes => {
      if (cubes.red) {
        totalRedCubes = cubes.red >= totalRedCubes ? cubes.red : totalRedCubes
      }
      if (cubes.green) {
        totalGreenCubes =
          cubes.green >= totalGreenCubes ? cubes.green : totalGreenCubes
      }
      if (cubes.blue) {
        totalBlueCubes =
          cubes.blue >= totalBlueCubes ? cubes.blue : totalBlueCubes
      }
    })
  })

  // salvo l'id
  numCubesPerExtract[index] = {
    ...numCubesPerExtract[index],
    id: session.id
  }

  // salvo il numero massimo di dadi rossi
  numCubesPerExtract[index] = {
    ...numCubesPerExtract[index],
    red: totalRedCubes
  }

  // salvo il numero massimo di dadi blu
  numCubesPerExtract[index] = {
    ...numCubesPerExtract[index],
    blue: totalBlueCubes
  }

  // salvo il numero massimo di dadi verdi
  numCubesPerExtract[index] = {
    ...numCubesPerExtract[index],
    green: totalGreenCubes
  }
})

const validInputId = numCubesPerExtract.map(extraction => {
  if (
    extraction.red <= maxNumRedCubesValid &&
    extraction.blue <= maxNumBlueCubesValid &&
    extraction.green <= maxNumGreenCubesValid
  ) {
    return +extraction.id
  }

  return 0
})

const idSum = validInputId.reduce((acc, value) => acc + value, 0)

console.log(idSum) // 2164 : risposta esatta!

// --- Part 2

/*
ogni estrazione (valida o meno) ha rivelato il numero minimo di dadi presenti nella borsa per ogni singolo colore

l'obiettivo è  moltiplicare per ogni sessione la quantità minima di dadi tra di loro (minimo dadi rossi * minimo dadi verdi * minimo dadi blu) e sommare il risultato tra le varie sessioni
*/
/**
 * @type {{id:string, red:number, blue:number,green:number, powerBetweenCubes:number}[]}
 */
const numCubesPerExtractWithPower = numCubesPerExtract.map(extraction => {
  return {
    ...extraction,
    powerBetweenCubes: extraction.red * extraction.blue * extraction.green
  }
})

const sumOfPowers = numCubesPerExtractWithPower.reduce(
  (acc, extraction) => acc + extraction.powerBetweenCubes,
  0
)

console.log(sumOfPowers) // 69929 : risposta esatta!
