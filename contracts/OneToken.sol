pragma solidity ^0.8.4;

import "./IERC20.sol";

contract OneToken is IERC20 {
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;
    uint256 totalSupply_;
    string public name = "One Token";
    string public symbol = "NTN";
    uint8 public decimals = 18;
    address minter;
    address burner;

    constructor(uint256 total, address owner) {
        totalSupply_ = total;
        if (owner == address(0)) balances[msg.sender] = total;
        else balances[owner] = total;
        minter = msg.sender;
        burner = msg.sender;
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "mint allowed only for minter");
        _;
    }

    modifier onlyBurner() {
        require(msg.sender == burner, "burn allowed only for burner");
        _;
    }

    function mint(address account, uint256 amount) public override onlyMinter {
        balances[account] += amount;
        totalSupply_ += amount;
    }

    function burn(address account, uint256 amount) public override onlyBurner {
        require(balances[account] >= amount, "not enought tokens on balance to burn");
        balances[account] -= amount;
        totalSupply_ -= amount;
    }

    function totalSupply() public view override returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address owner) public view override returns (uint256) {
        return balances[owner];
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

    function _transfer(address from, address to, uint256 amount) internal returns(bool success){

        balances[from] -= amount;
        allowed[from][to] -= amount;
        balances[to] += amount;
        success = true;
        emit Transfer(from, to, amount);
        return success;
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

    function allowance(address owner, address spender)
        public
        view
        override
        returns (uint256)
    {
        return allowed[owner][spender];
    }
}
