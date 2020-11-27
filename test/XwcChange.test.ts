import {expect, use} from 'chai';
import {Contract} from 'ethers';
import { BigNumber } from 'ethers'
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import XwcChange from '../build/XwcChange.json';
import BasicToken from '../build/BasicToken.json';

use(solidity);

describe('XwcChange', () => {
  const [wallet, wallet2] = new MockProvider().getWallets();
  let change: Contract;
  let token: Contract;

  beforeEach(async () => {
    token = await deployContract(wallet, BasicToken, [1000000]);
    change = await deployContract(wallet, XwcChange, [token.address]);
  });

  it('init empty record', async () => {
    let r = await change.getRecord(wallet.address)
    //console.log(r[0] == null)
    expect(r[0]).to.equal(undefined)
    expect(await change.admin()).to.eq(wallet.address)
    expect(await token.balanceOf(wallet.address)).to.eq(1000000)
  });

  it('change one', async () => {
    await token.transfer(wallet2.address, 1000000)
    await token.connect(wallet2).approve(change.address, 1000)
    await change.connect(wallet2).change(7, 'XWCNcdv7GfBGPKnhToV5pHdgGUVUFYidi71zw');
    await change.connect(wallet2).change(8, 'XWCNZg4XSf1DRHWDkSRiNyWWWRRLzgA6WiD4M');
    let r = await change.getRecord(wallet2.address)
    expect(r[0][0]).to.equal('XWCNcdv7GfBGPKnhToV5pHdgGUVUFYidi71zw');
    expect(r[0][1]).to.equal(BigNumber.from(7));
    expect(r[1][0]).to.equal('XWCNZg4XSf1DRHWDkSRiNyWWWRRLzgA6WiD4M');
    expect(r[1][1]).to.equal(BigNumber.from(8));
    expect(await token.balanceOf(wallet.address)).to.eq(15)
  });

  /*it('Transfer emits event', async () => {
    await expect(token.transfer(walletTo.address, 7))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, walletTo.address, 7);
  });

  it('Can not transfer above the amount', async () => {
    await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
  });

  it('Can not transfer from empty account', async () => {
    const tokenFromOtherWallet = token.connect(walletTo);
    await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
      .to.be.reverted;
  });

  it('Calls totalSupply on BasicToken contract', async () => {
    await token.totalSupply();
    expect('totalSupply').to.be.calledOnContract(token);
  });

  it('Calls balanceOf with sender address on BasicToken contract', async () => {
    await token.balanceOf(wallet.address);
    expect('balanceOf').to.be.calledOnContractWith(token, [wallet.address]);
  });*/
});
