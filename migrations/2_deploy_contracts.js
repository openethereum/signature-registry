"use strict";

const SignatureReg = artifacts.require("./SignatureReg.sol");

module.exports = deployer => {
  deployer.deploy(SignatureReg);
};
