pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    using SafeMath for uint;
    
    // Variables
    string public name = "Dip"; 
    string public symbol = "DIP"; 
    uint256 public decimals = 18; 
    uint256 public totalSupply ; 

    //Events
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    //Track balances
    mapping(address => uint256) public balanceOf;

    //Send tokens

    constructor() public {
        totalSupply = 1000000 * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
        //msg is a global variable in solidity
    }

    function transfer(address _to, uint256 _value) public returns (
        bool success){
        require(_to != address(0));
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

}