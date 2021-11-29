# Smart Contracts Design Considerations:

## Access Control Design Patterns

`Ownable` design pattern used in three functions: `update()`, `withdraw()`, `createService()` and `addMember()`. These functions do not need to be used by anyone else apart from the contract creator

Single-role to identify registered users that has been approved by the contract Owner to access `purchaseService()`.

## Inheritance and Interfaces

BMS contract inherits the OpenZeppelin `Ownable` contract to enable ownership for functions that can only be accessed by the contract owner.
