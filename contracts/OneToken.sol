pragma solidity ^0.8.4;

interface IERC20 {
    function mint(address account, uint256 value) external;

    function burn(address account, uint256 value) external;

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
    string public name = "One";
    string public symbol = "ntn";

    modifier enoughTokensOnBalance(uint256 numberTokens, address owner) {
        require(balances[owner] >= numberTokens, 'error');
        _;
    }

    modifier enoughAllowedTokens(
        address owner,
        address spender,
        uint256 numberTokens
    ) {
        if (numberTokens < this.allowance(owner, spender)) _;
    }

    modifier onlyPositiveValue(uint256 numberOfTokens) {
        if (numberOfTokens > 0) _;
    }

    constructor(uint256 total, address bank) {
        totalSupply_ = total;
        if (bank == address(0)) balances[msg.sender] = total;
        else balances[bank] = total;
    }

    function mint(address account, uint256 value) external override {
        balances[account] += value;
        totalSupply_ += value;
    }

    function burn(address account, uint256 value) external override {
        require(balances[account]>=value,'');
        balances[account] -= value;
        totalSupply_ -= value;
    }

    function totalSupply() external view override returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address owner) external view override returns (uint256) {
        return balances[owner];
    }

    function transferFrom(
        address from,
        address to,
        uint256 numberTokens
    )
        external
        override
        onlyPositiveValue(numberTokens)
        enoughTokensOnBalance(numberTokens, from)
        enoughAllowedTokens(from, to, numberTokens)
        returns (bool success)
    {
        balances[from] -= numberTokens;
        allowed[from][to] -= numberTokens;
        balances[to] += numberTokens;
        success = true;
        return success;
    }

    function transfer(address to, uint256 numberTokens)
        external
        override
        returns (bool)
    {
        return this.transferFrom(msg.sender, to, numberTokens);
    }

    function approve(address spender, uint256 numberTokens)
        external
        override
        returns (bool)
    {
        allowed[msg.sender][spender] = numberTokens;
        return true;
    }

    function allowance(address owner, address spender)
        external
        view
        override
        returns (uint256)
    {
        return allowed[owner][spender];
    }
}
