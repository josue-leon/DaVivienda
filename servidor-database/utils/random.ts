/**
 *
 * @param {number} min
 * @param {number} max
 * @returns
 */

export const numeroRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 *
 * @param {Array} lmin
 * @param {Array} lmax
 * @returns
 */

export const numeroRandomList = (lmin: Array<number>, lmax: Array<number>) => {
  if (lmin.length !== lmax.length) throw new Error("No valido")

  const index = numeroRandom(0, lmin.length - 1)

  return numeroRandom(lmin[index], lmax[index])
}
