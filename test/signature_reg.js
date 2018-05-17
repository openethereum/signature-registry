"use strict";

const SignatureReg = artifacts.require("./SignatureReg.sol");

contract("SignatureReg", accounts => {
  it("should register its own 'register' method signature", async () => {
    const signatureReg = await SignatureReg.deployed();

    const method = "register(string)";
    const signature = web3.sha3(method).slice(0, 10); // signature is bytes4

    const entry = await signatureReg.entries(signature);
    assert.equal(entry, method);

    const total = await signatureReg.totalSignatures();
    assert.equal(total, 1);
  });

  it("should allow registering a method signature", async () => {
    const signatureReg = await SignatureReg.deployed();

    const method = "hello_world(uint256,string,bool)";
    const signature = web3.sha3(method).slice(0, 10); // signature is bytes4

    const watcher = signatureReg.Registered();

    // test whether the call will be successfull (this is necessary to get the return value)
    const registered = await signatureReg.register.call(method);
    assert(registered);

    // do the actual transaction
    await signatureReg.register(method);

    // if successful the contract should emit a `Registered` event
    const events = await watcher.get();

    assert.equal(events.length, 1);
    assert.equal(events[0].args.creator, accounts[0]);
    assert.equal(events[0].args.signature, signature);
    assert.equal(events[0].args.method, method);

    // the number of registered signatures should increase
    const total = await signatureReg.totalSignatures();
    assert.equal(total, 2);

    const entry = await signatureReg.entries(signature);
    assert.equal(entry, method);
  });

  it("should only allow new registrations", async () => {
    const signatureReg = await SignatureReg.deployed();
    const method = "register(string)";

    const watcher = signatureReg.Registered();

    // trying to register an existing method
    // test whether the call will be successfull
    // (this is necessary to get the return value)
    const registered = await signatureReg.register.call(method);
    assert(!registered);

    // do the actual transaction
    await signatureReg.register(method);

    // no events should be emitted
    const events = await watcher.get();
    assert.equal(events.length, 0);

    // the number of registered signatures should not increase
    const total = await signatureReg.totalSignatures();
    assert.equal(total, 2);
  });
});
