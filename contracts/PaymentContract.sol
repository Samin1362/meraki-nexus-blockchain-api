// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentContract {
    // Events for transaction tracking
    event PaymentSent(
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        uint256 timestamp
    );
    
    event PaymentReceived(
        address indexed receiver,
        uint256 amount,
        uint256 timestamp
    );

    // Struct to store transaction details
    struct Transaction {
        address sender;
        address receiver;
        uint256 amount;
        uint256 timestamp;
        bool completed;
    }

    // Mapping to store transactions by ID
    mapping(uint256 => Transaction) public transactions;
    uint256 public transactionCounter;

    // Function to send payment
    function sendPayment(address receiver) public payable returns (uint256) {
        require(msg.sender != address(0), "Invalid sender address");
        require(receiver != address(0), "Invalid receiver address");
        require(msg.value > 0, "Amount must be greater than 0");
        require(msg.sender != receiver, "Sender and receiver cannot be the same");

        // Create transaction record
        uint256 transactionId = transactionCounter++;
        transactions[transactionId] = Transaction({
            sender: msg.sender,
            receiver: receiver,
            amount: msg.value,
            timestamp: block.timestamp,
            completed: true
        });

        // Transfer ETH to receiver
        (bool success, ) = receiver.call{value: msg.value}("");
        require(success, "Transfer failed");

        // Emit events
        emit PaymentSent(msg.sender, receiver, msg.value, block.timestamp);
        emit PaymentReceived(receiver, msg.value, block.timestamp);

        return transactionId;
    }

    // Function to get transaction details
    function getTransaction(uint256 transactionId) public view returns (
        address sender,
        address receiver,
        uint256 amount,
        uint256 timestamp,
        bool completed
    ) {
        Transaction memory transaction = transactions[transactionId];
        return (
            transaction.sender,
            transaction.receiver,
            transaction.amount,
            transaction.timestamp,
            transaction.completed
        );
    }

    // Function to get total transactions count
    function getTransactionCount() public view returns (uint256) {
        return transactionCounter;
    }

    // Function to check contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
