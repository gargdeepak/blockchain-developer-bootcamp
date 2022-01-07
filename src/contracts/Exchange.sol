// Deposit & Withdraw Funds
pragma solidity ^0.5.0;

import './Token.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

//[ ] Set the fee account
//[ ] Deposit Ether
//[ ] Withdraw Ether
//[ ] Deposit Tokens
//[ ] Withdraw tokens
//[ ] Check balances
//[ ] Make order
//[ ] Cancel order
//[ ] Fill order
//[ ] Charge fees

contract Exchange {
    using SafeMath for uint;


    address public feeAccount;
    uint256 public feePercent;
    address constant ETHER = address(0);

    //token address => user-account-address, amount
    mapping(address => mapping(address=>uint256)) public tokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint256 amount, uint256 balance);

    constructor(address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    //reverts if ether is sent directly to this contract address
    function() external {
        revert();
    }

    function depositToken(address _token, uint _amount) public {
        //don't allow ether deposit
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount); 
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
        //Whick token ?
        //How much ?
        //Send tokens to this contract
        //Manage deposit - update balance
        // Emit event
    }

    function depositEther() payable public {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);       
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function withdrawEther(uint _amount) payable public {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);       
        msg.sender.transfer(_amount);
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    function withdrawToken(address _token, uint _amount) payable public {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);       
        emit Withdraw(_token, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    function balanceOf(address _token, address _user) public view returns (uint256) {
        return tokens[_token][_user];
    }
}