import { tokens } from './helpers'

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

    describe('deployment', () =>{
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
      it('transfers token balances', async ()=> {
          let balanceOf
          //Before transfer
          balanceOf = await token.balanceOf(deployer)
          console.log("deployer balance before transfer", balanceOf.toString())
          balanceOf = await token.balanceOf(receiver)
          console.log("deployer balance before transfer", balanceOf.toString())

          //Transfer
          await token.transfer(receiver, tokens(100) )
          //After transfer
          balanceOf = await token.balanceOf(deployer)
          balanceOf.toString().should.equal(tokens(999900).toString())
          console.log("deployer balance after transfer", balanceOf.toString())
          balanceOf = await token.balanceOf(receiver)
          balanceOf.toString().should.equal(tokens(100).toString())
          console.log("deployer balance after transfer", balanceOf.toString())

      })  
    })

})