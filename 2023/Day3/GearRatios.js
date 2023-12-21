const { input } = require('./input.js')

/*
input:
i numeri sono numeri, il resto è stringa
*/

const onlyValidNumber = []
const onlyNumberToMultiply = []

// per ogni riga
input.forEach((row, indexRow, arrayRows) => {
  // per ogni valore della riga
  for (let index = 0; index < row.length; ) {
    const value = row[index]
    const isNumber = typeof value === 'number'

    // se si tratta di un numero
    if (isNumber) {
      //nuova struttura del valore
      const newValue = {
        value,
        valid: false,
        nextSibls: [],
        prevSibls: [],
        totalValue: ''
      }

      // salvo le righe limitrofe ed attuale
      const prevRow = arrayRows[indexRow - 1]
      const row = arrayRows[indexRow]
      const nextRow = arrayRows[indexRow + 1]

      //se c'è la riga precedente
      if (prevRow) {
        // se il valore predecente alla sua posizione, nella stessa, o successiva è diverso da '.', numero o non esistente
        if (
          (prevRow[index - 1] &&
            typeof prevRow[index - 1] !== 'number' &&
            prevRow[index - 1] !== '.') ||
          (typeof prevRow[index] !== 'number' && prevRow[index] !== '.') ||
          (prevRow[index + 1] &&
            typeof prevRow[index + 1] !== 'number' &&
            prevRow[index + 1] !== '.')
        ) {
          //quindi se è simbolo allora è valore valido
          newValue.valid = true
        }
      }

      // se dopo il precedente controllo il numero è ancora non valido
      if (!newValue.valid) {
        // se il valore predecente alla sua posizione o successiva è diverso da '.', numero o non esistente
        if (
          (row[index - 1] &&
            typeof row[index - 1] !== 'number' &&
            row[index - 1] !== '.') ||
          (row[index + 1] &&
            typeof row[index + 1] !== 'number' &&
            row[index + 1] !== '.')
        ) {
          //quindi se è simbolo allora è valore valido

          newValue.valid = true
        }
      }
      // se dopo i precedenti controlli il numero è ancora non valido e se c'è la riga successiva
      if (!newValue.valid && nextRow) {
        // se il valore predecente alla sua posizione, nella stessa, o successiva è diverso da '.', numero o non esistente
        if (
          (nextRow[index - 1] &&
            typeof nextRow[index - 1] !== 'number' &&
            nextRow[index - 1] !== '.') ||
          (typeof nextRow[index] !== 'number' && nextRow[index] !== '.') ||
          (nextRow[index + 1] &&
            typeof nextRow[index + 1] !== 'number' &&
            nextRow[index + 1] !== '.')
        ) {
          //quindi se è simbolo allora è valore valido
          newValue.valid = true
        }
      }

      // se numero è valido
      if (newValue.valid) {
        //controllo se ha numeri precedenti o successivi
        for (
          let numbSibiling = true, prevIndex = index, nextIndex = index;
          numbSibiling !== false;

        ) {
          if (typeof row[prevIndex - 1] === 'number') {
            newValue.prevSibls.push(row[prevIndex - 1])
            prevIndex--
          }
          if (typeof row[nextIndex + 1] === 'number') {
            newValue.nextSibls.push(row[nextIndex + 1])
            nextIndex++
          }

          if (
            typeof row[prevIndex - 1] !== 'number' &&
            typeof row[nextIndex + 1] !== 'number'
          ) {
            numbSibiling = false
          }
        }

        newValue.totalValue =
          (newValue.prevSibls.length >= 1
            ? newValue.prevSibls.reverse().join('')
            : ''
          ).trim() +
          newValue.value.toString() +
          (newValue.nextSibls.length >= 1
            ? newValue.nextSibls.join('')
            : ''
          ).trim()

        newValue.valid && onlyValidNumber.push(+newValue.totalValue)

        // salta i successivi elementi fratelli
        index =
          newValue.nextSibls.length !== 0
            ? index + 1 + newValue.nextSibls.length
            : index + 1
      } else {
        // altrimenti passa al prossimo valore
        index++
      }
    }
    // altrimenti passa al prossimo valore
    else {
      index++
    }
  }
})

const sum = onlyValidNumber.reduce((acc, value) => acc + value, 0)

console.log(sum) // 553825 : risposta esatta!

// --- Part 2

/*
[
  ['4','6','7','.','.','1','1','4','.','.'],
  ['.','.','.','*','.','.','.','.','.','.'],
  ['.','.','3','5','.','.','6','3','3','.'],
  ['.','.','.','.','.','.','#','.','.','.'],
  ['6','1','7','*','.','.','.','.','.','.'],
  ['.','.','.','.','.','+','.','5','8','.'],
  ['.','.','5','9','2','.','.','.','.','.'],
  ['.','.','.','.','.','.','7','5','5','.'],
  ['.','.','.','$','.','*','.','.','.','.'],
  ['.','6','6','4','.','5','9','8','.','.']
]

*/
const trulyValues = []
input.forEach((row, indexRow, arrayRows) => {
  // for (let index = 0; index < row.length; ) {
  //   const isAsterisk = row[index] === '*'

  //   if (isAsterisk) {
  //     const prevRow = arrayRows[indexRow - 1]
  //     const row = arrayRows[indexRow]
  //     const nextRow = arrayRows[indexRow + 1]

  //   } else {
  //     index++
  //   }
  // }

  row.forEach((value, indexValue, arrayValues) => {
    const isAsterisk = value === '*'

    if (isAsterisk) {
      const prevRow = arrayRows[indexRow - 1]
      const sameRow = arrayRows[indexRow]
      const nextRow = arrayRows[indexRow + 1]

      class asteriskObj {
        constructor () {
          this.indexRow = indexRow
          this.indexValue = indexValue
          this.topLeftPs = typeof prevRow[indexValue - 1] === 'number'
          this.leftPs = typeof sameRow[indexValue - 1] === 'number'
          this.rightPs = typeof sameRow[indexValue + 1] === 'number'
          this.bottomLeftPs = typeof nextRow[indexValue - 1] === 'number'

          this.topCenterPs =
            !this.topLeftPs && typeof prevRow[indexValue] === 'number'
          this.topRightPs =
            !this.topCenterPs && typeof prevRow[indexValue + 1] === 'number'
          this.bottomCenterPs =
            !this.bottomLeftPs && typeof nextRow[indexValue] === 'number'
          this.bottomRightPs =
            !this.bottomCenterPs && typeof nextRow[indexValue + 1] === 'number'

          this.validAsterisk =
            Object.entries(this).filter(
              ([key, value]) => typeof value === 'boolean' && !!value
            ).length === 2

          this.prevSibls = []
          this.nextSibls = []
        }
      }

      const asterisk = new asteriskObj()

      if (asterisk.validAsterisk) {
        Object.entries(asterisk).forEach(([key, value]) => {
          if (key.endsWith('Ps')) {
            if (value) {
              let rowToParse
              switch (key) {
                case 'topLeftPs':
                case 'topCenterPs':
                case 'topRightPs':
                  rowToParse = prevRow
                  break
                case 'leftPs':
                case 'rightPs':
                  rowToParse = sameRow
                  break
                case 'bottomLeftPs':
                case 'bottomCenterPs':
                case 'bottomRightPs':
                  rowToParse = nextRow
                  break
              }
              for (
                let numbSibiling = true,
                  prevIndex = asterisk.indexValue,
                  nextIndex = asterisk.indexValue;
                numbSibiling !== false;

              ) {
                if (typeof rowToParse[prevIndex] === 'number') {
                  asterisk.prevSibls.push(rowToParse[prevIndex])
                  prevIndex--
                }
                if (typeof rowToParse[nextIndex] === 'number') {
                  asterisk.nextSibls.push(rowToParse[nextIndex])
                  nextIndex++
                }
                if (
                  typeof rowToParse[prevIndex] !== 'number' &&
                  typeof rowToParse[nextIndex] !== 'number'
                ) {
                  numbSibiling = false
                }
              }

              ///// SONO FERMO QUI
            }
          }
        })
      }

      console.log(asterisk)
      // trulyValues.push()

      //     value.totalValue =
      //       (value.prevSibls.length >= 1
      //         ? value.prevSibls.reverse().join('')
      //         : ''
      //       ).trim() +
      //       value.value.toString() +
      //       (value.nextSibls.length >= 1 ? value.nextSibls.join('') : '').trim()
      //   })
      // }
    }
  })
})
