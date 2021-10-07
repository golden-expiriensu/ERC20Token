pragma solidity ^0.8.4;

interface IERC20 {
    function mint(address account, uint256 amount) external;

    function burn(address account, uint256 amount) external;

    function totalSupply() external view returns (uint256);

    function balanceOf(address owner) external view returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 numberTokens
    ) external returns (bool success);

    function transfer(address to, uint256 numberTokens) external returns (bool);

    function approve(address spender, uint256 numberTokens)
        external
        returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);
}

contract OneToken is IERC20 {
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;
    uint256 totalSupply_;
    string public name = "One Token";
    string public symbol = "ntn";
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
        require(balances[account] >= amount, "");
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
    ) public override returns (bool success) {

        require(from != address(0), "zero address not allowed (address from)");
        require(to != address(0), "zero address not allowed (address to)");
        require(balances[from] >= amount, "not enought tokens on balance");
        require(amount > 0, "amount <= 0");
        require(
            amount < this.allowance(from, to),
            "not enought allowed tokens"
        );

        balances[from] -= amount;
        allowed[from][to] -= amount;
        balances[to] += amount;

        success = true;
        return success;
    }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        return this.transferFrom(msg.sender, to, amount);
    }

    function approve(address spender, uint256 amount)
        public
        override
        returns (bool)
    {
        allowed[msg.sender][spender] = amount;
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
