# Dice Rolling
Random number generation simulating dice rolls.

## d operator
Dice roll operator. The **facets** of the die are specified by an integer to the right of the 'd' operator.
```
    d4 // Random number 1-4
    d1000 // Random number 1-1000
```
Optionally, a **number of rolls** can be specified by an integer to the left of the 'd' operator. The die will be rolled that number of times and the results added together.
```
    2d4 // random number 2-8
    3d6 // random number 3-18
    10d1 // 10 
```

# Math Operations
PEMDAS operations

## () parentheses
Parentheses can be used to force order of operations. 
```
    2+4*2 // result 10 
    (2+4)*2 // result 12
```

## ^ exponents
n^x to get the x power of n
```
    2^2 // 4
    3^4 // 81
```

## */ multiplication/division
n*x to multiply n by x. n/x to divide n by x;
```
    2*3 // 6
    -3*4 // -12
    3/2 // 1.5
    12/4 // 3
```


## +- addition/subtraction
n+x to add n to x. n-x to subtract x from n;
```
    1+1 // 2
    2-1 // 1
```

# D&D Module  
Utilities for Dungeons and Dragons tabletop roleplaying

## xd operator  
nxdy rolls a y-sided die n times, but keeps the rolls separated in an array sorted in descending order. This is used by the 'advantage/disadvantage' rules in D&D where the player rolls twice and picks the higher/lower of the results.
```
    2xd20 //Example output: [18, 11] 
    4xd4 // Example output: [4, 3, 3, 1]
```
