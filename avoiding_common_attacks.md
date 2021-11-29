# Security Considerations:

1. Specifies the version of Solidity. Lock pragmas to specific compiler version `0.8.5` - #SWC-103

2. Conforms to checks-effects-interactions pattern to protect against - #SWC-107

3. Check for conditions and throw an exception if the condition is not met - #SWC-110 & #SWC-123

4. Explicitly mark visibility in functions and state variables - #SWC-100 & #SWC-108

5. `withdraw()` is protected with OpenZeppelin `Ownable`s `onlyOwner` modifier. - #SWC-105

6. All functions that modify state are based on receiving calls rather than making contract calls. - Pull over push
