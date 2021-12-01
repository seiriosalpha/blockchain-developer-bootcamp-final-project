/// SPDX-License-Identifier: MIT

/// Specifies the version of Solidity
pragma solidity 0.8.5;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Contract for Blockchain Medical System
/// @author Samuel Tan
/// @notice Allows Medical and non-medical users to purchase medical services and service management
/// @dev Inherit from both OpenZeppelin Ownable and AccessControl contracts to implement role-based and owner-only functions 
contract BMS is Ownable, AccessControl {

    /// @notice Protect our users balance from other contracts
    mapping (address => uint256) private balances;

		/// @notice Struts mapping for Orders created 
    uint256 public orderCount = 0;
    mapping(uint256 => Order) public orders;

		/// @notice Struts mapping for services created
    uint256 public ServiceCount = 0;
    mapping(uint256 => Service) public services;

		/// @notice Struts mapping for users created
    uint256 public userCount = 0;
    mapping(address => User) public users;
 
    struct Order {
        uint256 oid;
        address payable seller;
        address payable buyer;
        string status;
        uint256 pid;
        uint256 quantitiy;
    }

    struct Service {
        uint256 pid;
        string name;
        uint256 price;
        address payable staff;
        string info;
        uint256 quantity;
    }

    struct User {
        uint256 uid;
        string name;
        address user;
        bool created;
    }

    /// @notice Emitted a health/medical service has been created
    /// @param pid service id
    /// @param name service name
		/// @param price service price
		/// @param staff the medical staff/owner address
		/// @param info service information
		/// @param quantity service quantity
    event ServiceCreated(
        uint256 pid,
        string name,
        uint256 price,
        address staff,
        string info,
        uint256 quantity
    );

		/// @notice Emitted a new user has been created
    /// @param uid user id
    /// @param name user name
		/// @param created true or false
    event  UserCreated(
        uint256 uid,
        string name,
        address user,
        bool created
    );

    /// @notice Emitted a health/medical service has been purchased
    /// @param oid order id
    /// @param seller owner's address
		/// @param buyer seller's address
		/// @param status to be set as Sold
		/// @param pid service id
		/// @param quantity service quantity
    event ServicePurchased(
        uint256 oid,
        address payable seller,
        address payable buyer,
        string status,
        uint256 pid,
        uint256 quantity
    );

		/// @notice Emitted the MOTD has been updated
    /// @param oldStr old message
    /// @param newStr new message
	  event UpdatedMessages(
				string oldStr,
				string newStr
    );

		/// @notice Emitted user has been approved and grant new role
    /// @param role DEFAULT_ADMIN_ROLE role to be granted
    /// @param sender the user's address
    event RoleGranted (
        bytes32 role,
        address sender
    );

		/// @notice Emitted payment has been received
    /// @param accountAddress buyer's address
    /// @param amount amount to be sent
    event LogPaymentReceived(
        address accountAddress,
        uint256 amount
    );

		/// @notice The MOTD message
		string public message;

		/// @notice Set the MOTD and assign owner with DEFAULT_ADMIN_ROLE during deployment of the contract
		/// @dev need to set the message and owner address in 2_deploy_contracts.js before deployment
    constructor(string memory initMessage, address root) {
      
	  	/// @dev Accepts a string argument `initMessage` and sets the value into the contract's `message` storage variable).
      message = initMessage;
      _setupRole(DEFAULT_ADMIN_ROLE, root);

    }

    /// @notice A modifier to restrict to registered users only functions
    modifier onlyMember() {
    	require(isMember(msg.sender), "Restricted to Registered Users Only.");
    	_;
    }

    /// @notice This fallback function will keep all the incoming Ether
    receive() external payable {
      receiveMoney();
    }

		/// @notice Performs the balance deduction from sender's wallet
    function receiveMoney() public payable {
			assert(balances[msg.sender] + msg.value >= balances[msg.sender]);
      balances[msg.sender] += msg.value;
      emit LogPaymentReceived(msg.sender, msg.value);
    }

    /// @notice Return `true` if the `account` is Registered.
		/// @param account user's address
    function isMember(address account) public virtual view returns (bool){
    	return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    /// @notice Owner to set register user account as approved user.
		/// @param account user's address
    function addMember(address account) public virtual onlyOwner {
    	grantRole(DEFAULT_ADMIN_ROLE, account);
    	emit RoleGranted(DEFAULT_ADMIN_ROLE, account);
    }
   
	  /// @notice A public function that accepts a string argument and updates the `MOTD` storage variable. Only accessibe by Owner
		/// @param newMessage the new MOTD to be set
    function update(string memory newMessage) public onlyOwner{
      string memory oldMsg = message;
      message = newMessage;
      emit UpdatedMessages(oldMsg, newMessage);
    }

    /// @notice Medical Staffs/Patient will have to register themselves and onboard somehow on the contract
		/// @param _name the name that will be set by the user
    function createUser(string memory _name) public{
      ///Check for repeated address
      require(users[msg.sender].created == false, 'User already created');
      ///Increase userCount
      userCount++;
      ///Add user
      users[msg.sender] = User(userCount, _name, msg.sender, true);
      ///Trigger an event
      emit UserCreated(userCount, _name, msg.sender, true);
    }

    /// @notice Medical Staffs (Owner) can create health services which can be purchased by the users only can be access by the Owner
		/// @param _name the name of the service
		/// @param _price the price of the service
		/// @param _info short description of the service
		/// @param _quantity the number of this servicee to be created
		/// @dev Check for price to be greater than 0 
    function createService(string memory _name, uint256 _price, string memory _info, uint256 _quantity) public onlyOwner{
      /// Require a valid price
      require(_price > 0, 'Invalid Price');
      /// Increment product count
      ServiceCount ++;
      /// Create the product
      services[ServiceCount] = Service(ServiceCount, _name, _price, payable(msg.sender), _info, _quantity);
      /// Trigger an event
      emit ServiceCreated(ServiceCount, _name, _price, msg.sender, _info, _quantity);
    }

		/// @notice Registered Users can purchase health services that has been created only can be access by approved users
		/// @param _id the service ID to be purchased
		/// @param _id the number of service package to be purchased
		/// @dev Check for exact payment and exact amount set in the front-end to avoid having to send ETH back to sender
    function purchaseService(uint256 _id, uint256 _quantity) public payable onlyMember{
      /// Fetch the service
      Service memory _service = services[_id];
      /// Fetch the owner
      address payable _staff = _service.staff;
      /// Make sure the service has a valid id
      require(_service.pid > 0 && _service.pid <= ServiceCount, 'Invalid Product ID');
			/// Make sure the service quantity is not 0
      require(_service.quantity > 0, 'Insufficient Stock!');
			/// Make sure the purchase quanity is enough 
      require(_service.quantity >= _quantity, 'Insufficient Stock!');
      /// Require that there is enough Ether in the transaction
      require(msg.value >= ((_service.price * _quantity) * (1 ether)), 'Not enough ether in Wallet');
      /// Require that the buyer is not the seller
      require(_staff != msg.sender,'Invalid Purchase');
      /// Incrmement orderCount
      orderCount++;
      /// Reduce the quantity of the product
      services[_id].quantity =  _service.quantity - 1;
      /// Transfer ownership to the buyer
      orders[orderCount] = Order(orderCount, _staff, payable(msg.sender), 'Ordered', _service.pid, _quantity);
      /// Pay the contract by sending them Ether
      payable(msg.sender).transfer(msg.value);
      /// Trigger an event
      emit ServicePurchased(orderCount, _staff, payable(msg.sender), 'Ordered', _service.pid, _quantity);
    	}

		/// @notice Medical Staffs can upload or edit the medical data.
    function addMedicalData(string memory _name) public returns (bool) {
			/// TODO: Create a new Patient data and put in array
    	/// TODO: Increment the ID by one
    	/// TODO: Emit the appropriate event
    	/// TODO: return true
		}

		/// @notice Medical Staffs/Patient have to identify themselves in order to securely access to the medical data.
  	function medicalData(uint sku) public {
 			/// TODO: Add modifiers to check the person calling this function is the Staffs/Patient. 
			/// TODO: call the event associated with this function!
			/// TODO: Present the data to user if user is Staff
			/// TODO: Present the data to user if payment has been completed
		}

		/// @notice Patient can authorize 3rd party access to securely access to the medical data.
		function signMedicalData() public{
  		/// TODO: it should Create a SHA3 hash of the message
  		/// TODO: Verify that the message's signer is the owner of the medical data
			/// TODO: Signs the messageHash with the Hospital account
  		/// TODO: set the state to Signed. 
		}

		/// @notice Verify the authenticity of the medical record using digital signature that uniquely identifies the issuer of the record.
		function verify() public {
  		/// TODO: It should recover signer address from a message by using their signature
  		/// TODO: Recover signer from signature and hash
  		/// TODO: Compare recovered signer to claimed signer
		}

		/// @notice Withdraw contract funds
    /// @dev Only the contract owner can call this
		function withdraw() public onlyOwner {
    	/// TODO: withdraw any funds from contract
    }

}
