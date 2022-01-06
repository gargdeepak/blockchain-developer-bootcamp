import { tokens, EVM_REVERT } from './helpers'

const Token = artifacts.require("./Token");

 
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', ([deployer, receiver, exchange]) => {
    let token
    const name = "Dip"
    const symbol = "DIP"
    const decimals = '18'
    const totalSupply = tokens(1000000)

    beforeEach(async ()=> {
        token = await Token.new()
    })

    describe('deployment', () => {
        it('tracks the name', async () => {
            const result = await token.name()
            result.should.equal(name)
        })

        it('tracks the symbol', async () => {
            const result = await token.symbol()
            result.should.equal(symbol)
        })

        it('tracks the decimals', async () => {
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        })

        it('tracks the totalSupply', async () => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply.toString())
        })

        it('tracks the balance of deployer', async () => {
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalSupply.toString())
        })
    })

    describe('sending tokens', () => {
        let result
        let amount

        describe('success', () => {
            beforeEach(async ()=> {
                amount = tokens(100)
                result = await token.transfer(receiver, amount, { from: deployer})
            })
        it('transfers token balances', async ()=> {
            let balanceOf
            //After transfer
            balanceOf = await token.balanceOf(deployer)
            balanceOf.toString().should.equal(tokens(999900).toString())
            console.log("deployer balance after transfer", balanceOf.toString())
            balanceOf = await token.balanceOf(receiver)
            balanceOf.toString().should.equal(tokens(100).toString())
            console.log("deployer balance after transfer", balanceOf.toString())
        })  

        it('emits a transfer event', async () => {
            const log = result.logs[0]
            log.event.should.eq('Transfer')
            const event = log.args
            event._from.toString().should.equal(deployer, 'from deployer')
            event._to.toString().should.equal(receiver, 'from receiver')
            event._value.toString().should.equal(amount.toString(), "amount is correct")
            // console.log(result.logs)
        })
    })

    describe('failure', async () => {
        it('rejects insufficient balances', async () => {
            let invalidAmount
            invalidAmount = tokens(10000000)
            await token.transfer(receiver, invalidAmount, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
    
        })


        it('rejects insufficient balances', async () => {
            let invalidAmount
            invalidAmount = tokens(10)
            await token.transfer(deployer, invalidAmount, {from: receiver}).should.be.rejectedWith(EVM_REVERT)
    
        })

        it('rejects invalid receipents', async () => {
            await token.transfer(0x0, amount, {from: deployer}).should.be.rejected
        })
    })
    })

    describe('approving tokens', () => {
        let result
        let amount
         
        beforeEach(async() => {
            amount = tokens(100)
            result = await token.approve(exchange, amount, {from: deployer})
        })

        describe('success', async () => {
            it('allocates an allowance for delegated token spending on exchange', async () => {
                const allowance = await token.allowance(deployer, exchange)
                allowance.toString().should.equal(amount.toString())
            })

            it('emits an approval event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Approval')
                const event = log.args
                event._owner.toString().should.equal(deployer, 'from deployer')
                event._spender.toString().should.equal(exchange, 'from receiver')
                event._value.toString().should.equal(amount.toString(), "amount is correct")
                // console.log(result.logs)
            })
        })

        describe('failure', async () => {
            it('rejects invalid receipents', async () => {
                await token.approve(0x0, amount, {from: deployer}).should.be.rejected
            })
        })

    })

    describe('delegated token transfers', () => {
        let result
        let amount
         
        beforeEach(async() => {
            amount = tokens(100)
            result = await token.approve(exchange, amount, {from: deployer})
        })
        
        describe('success', () => {
            beforeEach(async ()=> {
                amount = tokens(100)
                result = await token.transferFrom(deployer, receiver, amount, { from: exchange})
            })
            it('transfers token balances', async ()=> {
                let balanceOf
                //After transfer
                balanceOf = await token.balanceOf(deployer)
                balanceOf.toString().should.equal(tokens(999900).toString())
                console.log("deployer balance after transfer", balanceOf.toString())
                balanceOf = await token.balanceOf(receiver)
                balanceOf.toString().should.equal(tokens(100).toString())
                console.log("deployer balance after transfer", balanceOf.toString())
            })  

            it('emits a transfer event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Transfer')
                const event = log.args
                event._from.toString().should.equal(deployer, 'from deployer')
                event._to.toString().should.equal(receiver, 'from receiver')
                event._value.toString().should.equal(amount.toString(), "amount is correct")
                // console.log(result.logs)
            })
    })

    describe('failure', async () => {
        it('rejects insufficient balances', async () => {
            let invalidAmount
            invalidAmount = tokens(10000000)
            await token.transferFrom(deployer, receiver, invalidAmount, {from: exchange}).should.be.rejectedWith(EVM_REVERT)
    
        })

        it('rejects invalid receipents', async () => {
            await token.transferFrom(deployer, 0x0, amount, {from: exchange}).should.be.rejected
        })
    })
    })

})