pragma solidity ^0.8.4;

interface IERC20 {
    function mint(address account, uint256 amount) external;

    function burn(address account, uint256 amount) external;

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    
    event Approval(address indexed owner, address indexed spender, uint256 value);
}