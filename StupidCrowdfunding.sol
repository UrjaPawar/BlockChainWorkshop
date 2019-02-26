pragma solidity >=0.4.21 <0.6.0;
contract StupidCrowdfunding {
    
    uint _threshold = 50;
    uint _balance;
    event ReceivedContribution(address indexed _contributor, uint _valueInWei);
    event Disclosed(address indexed _beneficiary);
    mapping (address => uint) contributors;
    
    function contribute() payable public {
        require(msg.value>0);
        _balance += msg.value/(1000000000000000000);
        contributors[msg.sender] = msg.value;
        emit ReceivedContribution(msg.sender, msg.value);
    }
    
    function isOpen() public {
        require(contributors[msg.sender]>0);
        require(_balance>_threshold);
        emit Disclosed(msg.sender);
    }

    function getBalance() public view returns(uint) {
        return _balance;
    }
       
}
