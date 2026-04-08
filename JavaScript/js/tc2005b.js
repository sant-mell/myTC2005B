/*
 * Example functions to practice JavaScript
 *
 * Santiago Aguilar Mello
 * 2026-04-08
 */

"use strict";

// Escribe una funcion llamada firstNonRepeating que encuentre el primer
// caracter de una cadena de texto que no se repite.
function firstNonRepeating(string){
    const letters = [];
    for (let i=0; i<string.length; i++){
        let found = false;
        for (let item of letters){
            if (item.char === string[i]){
                item.count++;
                found = true;
                break;
            }
        }
        if (!found) letters.push({char: string[i], count: 1});
    }

    for (let index in letters){
        if (letters[index].count === 1) return letters[index].char;
    }
    return undefined;
}

//console.log(firstNonRepeating("Vladimir"))
//console.log(firstNonRepeating("AABCAAACD"))

// Escribe una funcion llamada bubbleSort que implemente el algoritmo
// bubble-sort para ordenar una lista de numeros.
function bubbleSort(array){
    for (let i=0; i<array.length-1;i++)
        for (let j=0; j < array.length-1-i; j++){
            if(array[j]>array[j+1]){
                let x = array[j];
                array [j]= array [j+1];
                array [j+1] = x;
            }
        }
    return array;
}

//const arr = [10,1,9,2,8,3,7,4,6,5]
//console.log(bubbleSort(arr))

// Escribe una funcion llamada invertArray que invierta un arreglo de numeros
// y regrese un nuevo arreglo con el resultado.
function invertArray (array) {
  let invertedArray = [];
  for(let i=0;i<array.length; i++){
    invertedArray [i] = array[array.length-i-1]
  }
  return invertedArray;
}

const arr = [1,2,3,4,5,6,7,8,9,10]
//console.log(invertArray(arr))

// Escribe una funcion llamada invertArrayInplace que modifique el mismo arreglo
// que se pasa como argumento, sin usar reverse.
function invertArrayInplace(array) {
  let temp = null
    for(let i=0; i<array.length/2; i++){
        temp = array[i];
        array[i] = array[array.length-1-i]
        array[array.length-1-i] = temp
  }
  return array;

}

//console.log(invertArrayInplace(arr))

// Escribe una funcion llamada capitalize que reciba una cadena de texto y
// regrese una nueva con la primer letra de cada palabra en mayuscula.
function capitalize(string){
  let resultado = "";
  let inicioDePalabra = true;

  for (let i = 0; i < string.length; i++) {
    const caracter = string[i];

    if (caracter === " ") {
      resultado += caracter;
      inicioDePalabra = true;
    } else {
      if (inicioDePalabra) {
        resultado += caracter.toUpperCase();
        inicioDePalabra = false;
      } else {
        resultado += caracter;
      }
    }
  }

  return resultado;
}

//console.log(capitalize("hola mundo jaja"))

// Escribe una funcion llamada mcd que calcule el maximo comun divisor de
// dos numeros.
function mcd(a, b) {  
  if (b === 0) {
    return a;
  }
  return mcd(b, a % b);
}
   
//console.log(mcd(48,18))

// Crea una funcion llamada hackerSpeak que cambie una cadena de texto
// a Hacker Speak.
function hackerSpeak(string){
  const map = {
    a: "4",
    e: "3",
    i: "1",
    o: "0",
    s: "5",
  };

  return string
    .split("")
    .map((char) => (map[char] ? map[char] : char))
    .join("");
}

//console.log(hackerSpeak("leetcoding"))

// Escribe una funcion llamada factorize que reciba un numero y regrese
// una lista con todos sus factores.
function factorize(num) {
  const factors = [];

  for (let i = 1; i <= num; i++) {
    if (num % i === 0) {
      factors.push(i);
    }
  }

  return factors;
}

//console.log(factorize(12))


// Escribe una funcion llamada deduplicate que quite los elementos duplicados
// de un arreglo y regrese una lista con los elementos que quedan.
function deduplicate(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    let exists = false;

    for (let j = 0; j < result.length; j++) {
      if (arr[i] === result[j]) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      result.push(arr[i]);
    }
  }

  return result;
}

//console.log(deduplicate([1, 0, 1, 1, 0, 0]))

// Escribe una funcion llamada findShortestString que reciba una lista de
// cadenas de texto y regrese la longitud de la cadena mas corta.
function findShortestString(arr){
  if(arr.length === 0) {
    return 0;
  }
  let shortest = arr[0].length;
  for (let i=1;i<arr.length;i++){
    if (arr[i].length < arr[shortest].length){
        shortest = i;
    } 

  }
  return arr[shortest].length;
}

//console.log(findShortestString(["gato", "sol", "elefante"]))

// Escribe una funcion llamada isPalindrome que revise si una cadena de texto
// es un palindromo o no.
function isPalindrome(string){
  let pila = [];
 for(let i=0;i<string.length;i++){
  pila.push(string[i])
 }
 let invertido = '';
 while (pila.length > 0){
  invertido = invertido + pila.pop()
 }
 return invertido == string;
}

//console.log(isPalindrome("ana"))
//console.log(isPalindrome("perro"))

// Escribe una funcion llamada sortStrings que tome una lista de cadenas de
// texto y devuelva una nueva lista en orden alfabetico.
function sortStrings(arrStrings){
  return bubbleSort(arrStrings);
}

//console.log(sortStrings(["one", "two", "thr", "fou"]))

// Escribe una funcion llamada stats que tome una lista de numeros y devuelva
// una lista con dos elementos: el promedio y la moda.
function stats(arr){
  if (arr.length === 0) {
    return [0, 0];
  }
  let suma = 0;
  let promedio = 0;
  let count = {};
  let moda = arr[0];

  for (let i=0; i<arr.length; i++){
    suma = suma + arr[i];
    promedio = suma/arr.length;
  }
  for (let j=0; j<arr.length; j++){
    if (count[arr[j]] === undefined){
      count[arr[j]] = 1;
    } else {
      count[arr[j]]++;
    }
    if (count[arr[j]] > count[moda]){
      moda = arr[j];
    }
  }
  return [promedio, moda];
}

//console.log(stats([8, 4, 2, 6, 8, 13, 17, 2, 4, 8]))
// Escribe una funcion llamada popularString que tome una lista de cadenas de
// texto y devuelva la cadena mas frecuente.
function popularString(arr){
  let count = {};
  let maxCount = 0;
  let popular = "";

  for (let str of arr) {
    count[str] = (count[str] || 0) + 1;
    if (count[str] > maxCount) {
      maxCount = count[str];
      popular = str;
    }
  }

  return popular;
}

//console.log(popularString(["one", "two", "one", "three", "one"]))

// Escribe una funcion llamada isPowerOf2 que tome un numero y devuelva
// verdadero si es potencia de dos, falso de lo contrario.
function isPowerOf2(num){
  if (num <= 0) {
    return false;
  }
  for (let i = 1; i <= num; i *= 2) {
    if (i === num) {
      return true;
    }
  }
  return false;
}

//console.log(isPowerOf2(1024))
// Escribe una funcion llamada sortDescending que tome una lista de numeros y
// devuelva una nueva lista con todos los numeros en orden descendente.
function sortDescending(arr){
  return bubbleSort(arr).reverse(); //makes a bubble sort and then reverses it
}

//console.log(sortDescending([9, 6, 15, 3, 12]))

export {
    firstNonRepeating,
    bubbleSort,
    invertArray,
    invertArrayInplace,
    capitalize,
    mcd,
    hackerSpeak,
    factorize,
    deduplicate,
    findShortestString,
    isPalindrome,
    sortStrings,
    stats,
    popularString,
    isPowerOf2,
    sortDescending,
};

