import { tokens, EVM_REVERT, ETHER_ADDRESS, ether } from './helpers'

const Exchange = artifacts.require("./Exchange");
const Token = artifacts.require("./Token");

 
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Exchange', ([deployer, feeAccount, user1]) => {
    let exchange
    let token
    const feePercent = 10

    beforeEach(async ()=> {
        token = await Token.new()
        exchange = await Exchange.new(feeAccount, feePercent)
        token.transfer(user1, tokens(100), { from: deployer} )
    })

    describe('deployment', () => {
        it('tracks the feeAccount', async () => {
            const result = await exchange.feeAccount()
            result.toString().should.equal(feeAccount.toString())
        })

        it('tracks the feePercent', async () => {
            const result = await exchange.feePercent()
            result.toString().should.equal(feePercent.toString())
        })
    })

    describe('depositing tokens', () => {
        let result
        let amount

        beforeEach(async () => {
            amount = tokens(10)
            await token.approve(exchange.address, amount, {from: user1})
            result = await exchange.depositToken(token.address, amount, {from: user1})
        })
        describe('success', () => {
            it('tracks the token deposit', async () => {
                let balance
                balance = await token.balanceOf(exchange.address)
                balance.toString().should.equal(amount.toString())
                balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal(amount.toString())
            })

            it('emits a deposit event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Deposit')
                const event = log.args
                event.token.toString().should.equal(token.address, 'token address')
                event.user.toString().should.equal(user1, 'from receiver')
                event.amount.toString().should.equal(amount.toString(), "amount is correct")
                event.balance.toString().should.equal(amount.toString(), "amount is correct")
                // console.log(result.logs)
            })
        })
        describe('failure', () => {
            it('fails if ether is deposited', async () => {
                await exchange.depositToken(ETHER_ADDRESS,
                    amount, {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
            it('fails if tokens arent approved', async () => {
                await exchange.depositToken(token.address, amount, {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('depositing ether', () => {
        let result
        let amount

        beforeEach(async () => {
            amount = ether(1)
            result = await exchange.depositEther({from: user1, value: amount})
        })
        describe('success', () => {
            it('tracks the ether deposit', async () => {
                let balance
                balance = await exchange.tokens(ETHER_ADDRESS, user1)
                balance.toString().should.equal(amount.toString())
            })

            it('emits a deposit event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Deposit')
                const event = log.args
                event.token.toString().should.equal(ETHER_ADDRESS, 'ether address')
                event.user.toString().should.equal(user1, 'from receiver')
                event.amount.toString().should.equal(amount.toString(), "amount is correct")
                event.balance.toString().should.equal(amount.toString(), "amount is correct")
            })
        })
    })

    describe('fallback sending ether direct to contract', () => {
        it('revert when ether is sent', async () => {
            await exchange.sendTransaction({from: user1, value: 1}).should.be.rejectedWith(EVM_REVERT)
        })
        // it('fails if tokens arent approved', async () => {
        //     await exchange.depositToken(token.address, amount, {from: user1}).should.be.rejectedWith(EVM_REVERT)
        // })
    })

    describe('withdrawing tokens', () => {
        let result
        let amount

        beforeEach(async () => {
            amount = tokens(10)
            await token.approve(exchange.address, amount, {from: user1})
            await exchange.depositToken(token.address, amount, {from: user1})
            result = await exchange.withdrawToken(token.address, amount, {from: user1})
        })
        describe('success', () => {
            it('tracks the token withdrawal', async () => {
                let balance
                // balance = await token.balanceOf(exchange.address)
                // balance.toString().should.equal('0')
                balance = await exchange.balanceOf(token.address, user1)
                balance.toString().should.equal('0')
            })

            it('emits a withdraw event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Withdraw')
                const event = log.args
                event.token.toString().should.equal(token.address, 'token address')
                event.user.toString().should.equal(user1, 'from receiver')
                event.amount.toString().should.equal(amount.toString(), "amount is correct")
                event.balance.toString().should.equal('0', "balance is correct")
                // console.log(result.logs)
            })
        })
        describe('failure', () => {
            it('fails if ether is deposited', async () => {
                await exchange.withdrawToken(ETHER_ADDRESS,
                    amount, {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
            it('fails if tokens arent approved', async () => {
                await exchange.withdrawToken(token.address, amount, {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })
 
    describe('withdrawing ether', () => {
        let result
        let amount

        beforeEach(async () => {
            amount = ether(1)
            await exchange.depositEther({from: user1, value: amount})
            result = await exchange.withdrawEther(amount, {from: user1})
        })
        describe('success', () => {
            it('tracks the ether withdrawal', async () => {
                let balance
                balance = await exchange.balanceOf(ETHER_ADDRESS, user1)
                balance.toString().should.equal('0')
            })

            it('emits a withdraw event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Withdraw')
                const event = log.args
                event.token.toString().should.equal(ETHER_ADDRESS, 'token address')
                event.user.toString().should.equal(user1, 'from receiver')
                event.amount.toString().should.equal(amount.toString(), "amount is correct")
                event.balance.toString().should.equal('0', "balance is correct")
                // console.log(result.logs)
            })
        })
        describe('failure', () => {
            // it('fails if ether is deposited', async () => {
            //     await exchange.withdrawToken(ETHER_ADDRESS,
            //         amount, {from: user1}).should.be.rejectedWith(EVM_REVERT)
            // })
            // it('fails if tokens arent approved', async () => {
            //     await exchange.withdrawToken(token.address, amount, {from: user1}).should.be.rejectedWith(EVM_REVERT)
            // })
        })
    })

})