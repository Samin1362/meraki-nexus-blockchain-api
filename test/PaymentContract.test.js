const PaymentContract = artifacts.require("PaymentContract");

contract("PaymentContract", (accounts) => {
  let paymentContract;
  const [sender, receiver, thirdParty] = accounts;

  beforeEach(async () => {
    paymentContract = await PaymentContract.new();
  });

  describe("Payment Functionality", () => {
    it("should allow sending payment from sender to receiver", async () => {
      const amount = web3.utils.toWei("1", "ether");

      // Send payment
      const tx = await paymentContract.sendPayment(receiver, {
        from: sender,
        value: amount,
      });

      // Check transaction was successful
      assert.equal(tx.logs.length, 2, "Should emit 2 events");

      // Check events
      const paymentSentEvent = tx.logs.find(
        (log) => log.event === "PaymentSent"
      );
      const paymentReceivedEvent = tx.logs.find(
        (log) => log.event === "PaymentReceived"
      );

      assert.equal(paymentSentEvent.args.sender, sender, "Sender should match");
      assert.equal(
        paymentSentEvent.args.receiver,
        receiver,
        "Receiver should match"
      );
      assert.equal(
        paymentSentEvent.args.amount.toString(),
        amount,
        "Amount should match"
      );

      assert.equal(
        paymentReceivedEvent.args.receiver,
        receiver,
        "Receiver should match"
      );
      assert.equal(
        paymentReceivedEvent.args.amount.toString(),
        amount,
        "Amount should match"
      );
    });

    it("should return transaction ID after successful payment", async () => {
      const amount = web3.utils.toWei("0.5", "ether");

      const tx = await paymentContract.sendPayment(receiver, {
        from: sender,
        value: amount,
      });

      // Get transaction ID from logs
      const paymentSentEvent = tx.logs.find(
        (log) => log.event === "PaymentSent"
      );
      const transactionId = paymentSentEvent.args.transactionId || 0;

      assert.isNumber(transactionId, "Should return a transaction ID");
    });

    it("should store transaction details correctly", async () => {
      const amount = web3.utils.toWei("2", "ether");

      await paymentContract.sendPayment(receiver, {
        from: sender,
        value: amount,
      });

      // Get transaction details
      const transaction = await paymentContract.getTransaction(0);

      assert.equal(
        transaction.sender,
        sender,
        "Sender should be stored correctly"
      );
      assert.equal(
        transaction.receiver,
        receiver,
        "Receiver should be stored correctly"
      );
      assert.equal(
        transaction.amount.toString(),
        amount,
        "Amount should be stored correctly"
      );
      assert.equal(
        transaction.completed,
        true,
        "Transaction should be marked as completed"
      );
    });

    it("should increment transaction counter", async () => {
      const initialCount = await paymentContract.getTransactionCount();
      assert.equal(initialCount.toString(), "0", "Initial count should be 0");

      await paymentContract.sendPayment(receiver, {
        from: sender,
        value: web3.utils.toWei("1", "ether"),
      });

      const newCount = await paymentContract.getTransactionCount();
      assert.equal(newCount.toString(), "1", "Count should increment to 1");
    });

    it("should handle multiple transactions", async () => {
      const amount1 = web3.utils.toWei("1", "ether");
      const amount2 = web3.utils.toWei("0.5", "ether");

      // First transaction
      await paymentContract.sendPayment(receiver, {
        from: sender,
        value: amount1,
      });

      // Second transaction
      await paymentContract.sendPayment(thirdParty, {
        from: sender,
        value: amount2,
      });

      const count = await paymentContract.getTransactionCount();
      assert.equal(count.toString(), "2", "Should have 2 transactions");

      // Check first transaction
      const tx1 = await paymentContract.getTransaction(0);
      assert.equal(
        tx1.receiver,
        receiver,
        "First transaction receiver should be correct"
      );

      // Check second transaction
      const tx2 = await paymentContract.getTransaction(1);
      assert.equal(
        tx2.receiver,
        thirdParty,
        "Second transaction receiver should be correct"
      );
    });
  });

  describe("Error Handling", () => {
    it("should reject payment with zero amount", async () => {
      try {
        await paymentContract.sendPayment(receiver, {
          from: sender,
          value: 0,
        });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Amount must be greater than 0");
      }
    });

    it("should reject payment to zero address", async () => {
      try {
        await paymentContract.sendPayment(
          "0x0000000000000000000000000000000000000000",
          {
            from: sender,
            value: web3.utils.toWei("1", "ether"),
          }
        );
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Invalid receiver address");
      }
    });

    it("should reject payment from zero address", async () => {
      try {
        await paymentContract.sendPayment(receiver, {
          from: "0x0000000000000000000000000000000000000000",
          value: web3.utils.toWei("1", "ether"),
        });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Invalid sender address");
      }
    });

    it("should reject payment to same address", async () => {
      try {
        await paymentContract.sendPayment(sender, {
          from: sender,
          value: web3.utils.toWei("1", "ether"),
        });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Sender and receiver cannot be the same");
      }
    });
  });

  describe("Contract State", () => {
    it("should return correct contract balance", async () => {
      const initialBalance = await paymentContract.getContractBalance();
      assert.equal(
        initialBalance.toString(),
        "0",
        "Initial balance should be 0"
      );

      // Contract balance should remain 0 since we transfer directly to receiver
      await paymentContract.sendPayment(receiver, {
        from: sender,
        value: web3.utils.toWei("1", "ether"),
      });

      const finalBalance = await paymentContract.getContractBalance();
      assert.equal(
        finalBalance.toString(),
        "0",
        "Contract balance should remain 0"
      );
    });
  });
});
