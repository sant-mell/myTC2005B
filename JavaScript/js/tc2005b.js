/*
 * Example functions to practice JavaScript
 *
 * Santiago Aguilar Mello
 * 2026-03-26
 */

"use strict";

//firstNonRepeating definicion
//
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

//firstNonRepeating prueba

//console.log(firstNonRepeating("Vladimir"))
//console.log(firstNonRepeating("AABCAAACD"))

//bubbleSort definicion
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

//bubbleSort prueba

//const arr = [10,1,9,2,8,3,7,4,6,5]
//console.log(bubbleSort(arr))

//invertArray definicion
//
function invertArray (array) {
  let invertedArray = [];
  for(let i=0;i<array.length; i++){
    invertedArray [i] = array[array.length-i-1]
  }
  return invertedArray;
}

//invertedArray prueba
const arr = [1,2,3,4,5,6,7,8,9,10]
//console.log(invertArray(arr))

//invertedArrayInplace definicion
//
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

//capitaliza definicion
//
function capitalize(string){
  const words = string.split(" ").map(word => word ? word[0].toUpperCase() + word.slice(1):"");
  return words.join(" ");
}

//console.log(capitalize("hola mundo jaja"))

function mcd(a, b) {  
  if (b === 0) {
    return a;
  }
  return mcd(b, a % b);
}
   
//console.log(mcd(48,18))

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

//funcion factorize definicion
//
function factorize(num) {
  const factors = [];

  for (let i = 1; i <= num; i++) {
    if (num % i === 0) {
      factors.push(i);
    }
  }

  return factors;
}


//function deduplicate
//
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

function sortStrings

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
    /*sortStrings,
    stats,
    popularString,
    isPowerOf2,
    sortDescending,*/
};
