// SPDX-License-Identifier: MIT

/*
______             _                           
| ___ \           | |                          
| |_/ / __ _ _ __ | | __                       
| ___ \/ _` | '_ \| |/ /                       
| |_/ / (_| | | | |   <                        
\____/ \__,_|_| |_|_|\_\                                    
                                               
        __                                     
       / _|                                    
  ___ | |_                                     
 / _ \|  _|                                    
| (_) | |                                      
 \___/|_|                                                          
                                               
 _____ _   _                                   
|  ___| | | |                                  
| |__ | |_| |__   ___ _ __ ___ _   _ _ __ ___  
|  __|| __| '_ \ / _ \ '__/ _ \ | | | '_ ` _ \ 
| |___| |_| | | |  __/ | |  __/ |_| | | | | | |
\____/ \__|_| |_|\___|_|  \___|\__,_|_| |_| |_|
                                               
                                               
*/
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BankOfEthereum is ReentrancyGuard {
    mapping (address => uint) public balances;

    event DepositMade(address indexed _from, uint _value);
    event WithdrawalMade(address indexed _to, uint _value);

    function deposit() public payable {
        require(msg.value > 0, "Deposit must be greater than 0");
        balances[msg.sender] += msg.value;
        emit DepositMade(msg.sender, msg.value);
    }

    function withdraw(uint amount) public nonReentrant { 
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(amount <= balances[msg.sender], "Not enough balance");
        balances[msg.sender] -= amount; 
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        emit WithdrawalMade(msg.sender, amount); 
    } 
}
