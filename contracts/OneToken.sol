pragma solidity ^0.8.4;

import "./IERC20.sol";

contract OneToken is IERC20 {
    uint256 totalSupply_;
    string public name = "One Token";
    string public symbol = "NTN";
    uint8 public decimals = 18;
    address owner;
    mapping(address => bool) minters;
    mapping(address => bool) burners;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    constructor(uint256 total, address _owner) {
        totalSupply_ = total;
        balances[_owner] = total;
        owner = _owner;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier onlyMinter() {
        require(minters[msg.sender], "mint allowed only for minter");
        _;
    }

    modifier onlyBurner() {
        require(burners[msg.sender], "burn allowed only for burner");
        _;
    }

    function mint(address account, uint256 amount) public override onlyMinter {
        balances[account] += amount;
        totalSupply_ += amount;
    }

    function addMinter(address account) public onlyOwner {
        minters[account] = true;
    }

    function burn(address account, uint256 amount) public override onlyBurner {
        require(balances[account] >= amount, "not enought tokens on balance to burn");
        balances[account] -= amount;
        totalSupply_ -= amount;
    }

    function addBurner(address account) public onlyOwner {
        burners[account] = true;
    }

    function totalSupply() public view override returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address _owner) public view override returns (uint256) {
        return balances[_owner];
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {

        require(from != address(0), "zero address not allowed (address from)");
        require(to != address(0), "zero address not allowed (address to)");
        require(balances[from] >= amount, "not enought tokens on balance");
        require(amount > 0, "allowed to transfer only positive amount");
        require(
            amount < this.allowance(from, to),
            "not enought allowed tokens"
        );

        return _transfer(from, to, amount);
    }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        return _transfer(msg.sender, to, amount);
    }

    function approve(address spender, uint256 amount)
        public
        override
        returns (bool)
    {
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {

        uint256 currentAllowance = allowed[msg.sender][spender];
        approve(spender, currentAllowance + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {

        uint256 currentAllowance = allowed[msg.sender][spender];
        require(currentAllowance >= subtractedValue, "Decreased allowance below zero");
        approve(spender, currentAllowance - subtractedValue);

        return true;
    }

    function allowance(address _owner, address spender)
        public
        view
        override
        returns (uint256)
    {
        return allowed[_owner][spender];
    }

    function _transfer(address from, address to, uint256 amount) internal returns(bool success){

        balances[from] -= amount;
        allowed[from][to] -= amount;
        balances[to] += amount;
        success = true;
        emit Transfer(from, to, amount);
        return success;
    }
}
