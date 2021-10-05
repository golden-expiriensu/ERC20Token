pragma solidity ^0.8.4;

contract OneToken {
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;
    uint256 totalSupply_;

    modifier enoughTokensOnBalance(uint256 numberTokens, address owner) {
        if (balances[owner] >= numberTokens) _;
    }

    modifier enoughAllowedTokens(
        address owner,
        address spender,
        uint256 numberTokens
    ) {
        if (numberTokens < allowance(owner, spender)) _;
    }

    constructor(uint256 total, address bank) {
        totalSupply_ = total;
        if (bank == address(0)) balances[msg.sender] = total;
        else balances[bank] = total;
    }

    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    function getBalance(address owner) public view returns (uint256) {
        return balances[owner];
    }

    function transferFrom(
        address from,
        address to,
        uint256 numberTokens
    )
        public
        enoughTokensOnBalance(numberTokens, from)
        enoughAllowedTokens(from, to, numberTokens)
        returns (bool)
    {
        balances[from] -= numberTokens;
        allowed[from][to] -= numberTokens;
        balances[to] += numberTokens;
        return true;
    }

    function transfer(address to, uint256 numberTokens) public returns (bool) {
        return transferFrom(msg.sender, to, numberTokens);
    }

    function approve(address spender, uint256 numberTokens)
        public
        returns (bool)
    {
        allowed[msg.sender][spender] += numberTokens;
        return true;
    }

    function allowance(address owner, address spender)
        public
        view
        returns (uint256)
    {
        return allowed[owner][spender];
    }
}
