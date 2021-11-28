/// SPDX-License-Identifier: MIT

/** 
Specifies the version of Solidity, using semantic versioning.
Lock pragmas to specific compiler version - #SWC-103
*/
pragma solidity 0.8.5;

/** Defines an interface named `MyInterface`.
*/
interface MyInterface {
    function getAmt() external view returns (uint256);
}

/** Defines a contract named `BMS`.
Explicitly mark visibility in functions and state variables - #SWC-100 & #SWC-108
*/
contract BMS{

  /// Hint: We want to protect our users balance from other contracts
  mapping (address => uint256) private balances;
   
	 /** Declares a state variable `message` of type `string`.
   State variables are variables whose values are permanently stored in contract storage. The keyword `public` makes variables accessible from outside a contract and creates a function that other contracts or clients can call to access the value.
   */
  uint public orderCount = 0;
  mapping(uint => Order) private orders;

  uint public ServiceCount = 0;
  mapping(uint => Service) public services;

  uint public userCount = 0;
  mapping(address => User) public users;

    /// <owner>
  address private owner = msg.sender;

  string public message;
    
  uint256 public TotalAmt;
    
  bool private lock;

  struct Order {
        uint oid;
        address payable seller;
        address payable buyer;
        string status;
        uint pid;
        uint quantitiy;
  }

  struct Service {
        uint pid;
        string name;
        uint price;
        address payable staff;
        string info;
        uint quantity;
  }

  struct User {
        uint uid;
        string name;
        uint role;
        address user;
        bool created;
  }

	/** Emitted when update function is called
   Smart contract events are a way for your contract to communicate that something happened on the blockchain to your app front-end, which can be 'listening' for certain events and take action when they happen.
   */

  event ServiceCreated(
        uint pid,
        string name,
        uint price,
        address staff,
        string info,
        uint quantity
  );

  event  UserCreated(
        uint uid,
        string name,
        uint role,
        address user,
        bool created
  );

  event ServicePurchased(
        uint oid,
        address payable seller,
        address payable buyer,
        string status,
        uint pid,
        uint quantity
  );

  event UpdatedMessages(
				string oldStr,
				string newStr
	);

  event UpdatedAmt(
				uint256 oldAmt, 
				uint256 newAmt
	);

  /** Emitted when update function is called
	Add 2 arguments for this event, an accountAddress and an amount
	*/
  //event LogDepositMade(address accountAddress, uint256 amount);

	// Similar to many class-based object-oriented languages, a constructor is a special function that is only executed upon contract creation.
  constructor(string memory initMessage) {
      
	/// Accepts a string argument `initMessage` and sets the value into the contract's `message` storage variable).
      message = initMessage;
      TotalAmt = 0;
  }
	
	/**
  Using modifiers only for check for only Owner Functions
  */
	modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can register a user.");
        _;
  }

	/** 
	Fallback function - Called if other functions don't match call or
  sent ether without data
  Typically, called when invalid data is sent
  Added so ether sent to this contract is reverted if the contract fails
  otherwise, the sender's money is transferred to contract
	*/
  receive() external payable {
		revert();
  }

  function setAmt(uint256 newAmt) public returns(bool) {
        uint256 oldAmt = TotalAmt;
        TotalAmt = newAmt;
        emit UpdatedAmt(oldAmt, newAmt);
        return true;
  }

  function getAmt() public view returns (uint256) {
        //uint256 surchargefees = 10;
        //uint256 finalamt = TotalAmt + surchargefees;
        return TotalAmt;
  }
   
	 /// A public function that accepts a string argument and updates the `message` storage variable.
  function update(string memory newMessage) public onlyOwner {
      string memory oldMsg = message;
      message = newMessage;
      emit UpdatedMessages(oldMsg, newMessage);
  }

/**
Checks-Effects-Interactions Pattern - #SWC-107
*/
  function createUser(string memory _name, uint _role) public {
        ///No repeated address
        require(users[msg.sender].created == false, 'User already created');
        ///Increase userCount
        userCount++;
        ///Add user
        users[msg.sender] = User(userCount, _name, _role, msg.sender, true);
        ///Trigger an event
        emit UserCreated(userCount, _name, _role, msg.sender, true);
  }

  function createService(string memory _name, uint _price, string memory _info, uint _quantity) public onlyOwner{
        /// Require a valid price
        require(_price > 0, 'Invalid Price');
        /// Increment product count
        ServiceCount ++;
        /// Create the product
        services[ServiceCount] = Service(ServiceCount, _name, _price, payable(msg.sender), _info, _quantity);
        /// Trigger an event
        emit ServiceCreated(ServiceCount, _name, _price, msg.sender, _info, _quantity);
  }

	function purchaseService(uint _id, uint _quantity) public payable {
        /// Fetch the product
        Service memory _service = services[_id];
        /// Fetch the owner
        address payable _staff = _service.staff;
        /// Validate the buyer
        require(users[msg.sender].created == true, 'Unregistered user');
        /// Make sure the product has a valid id
        require(_service.pid > 0 && _service.pid <= ServiceCount, 'Invalid Product ID');
        /// Require that there is enough Ether in the transaction
        require(msg.value >= _service.price, 'Not enough ether in Wallet');
        /// Require that the buyer is not the seller
        require(_staff != msg.sender,'Invalid Purchase');
        /// Incrmement orderCount
        orderCount++;
        /// Reduce the quantity of the product
        services[_id].quantity =  _service.quantity - 1;
        /// Transfer ownership to the buyer
        orders[orderCount] = Order(orderCount, _staff, payable(msg.sender),  'Ordered', _service.pid, _quantity);
        /// Pay the contract by sending them Ether
        payable(msg.sender).transfer(msg.value);
        /// Trigger an event
        emit ServicePurchased(orderCount, _staff, payable(msg.sender), 'Ordered', _service.pid, _quantity);
  }

/**
     /// Conforms to checks-effects-interactions pattern to protect against #SWC-107 - Reentrancy
    function transfer(address addr, uint amount) external {
    require(!lock);
    lock = true;
    if (balances[msg.sender] >= amount) {
        balances[addr] += amount;
        balances[msg.sender] -= amount;
    }
    lock = false;
    }
*/
}

