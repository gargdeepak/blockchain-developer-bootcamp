const Token = artifacts.require("./Token");

require('chai')
    .use(require('chai-as-promised'))
    .should()

const tokens = (n) => {
    return new web3.utils.BN(
        web3.utils.toWei(n.toString(), 'ether')
    )
}

contract('Token', ([deployer, receiver, exchange]) => {
    let token
    const name = "Dip"
    const symbol = "DIP"
    const decimals = '18'
    const totalSupply = '1000000000000000000000000'

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
            result.toString().should.equal(totalSupply)
        })

        it('tracks the balance of deployer', async () => {
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalSupply)
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
          await token.transfer(receiver, '1000000000000000000')
          //After transfer
          balanceOf = await token.balanceOf(deployer)
          console.log("deployer balance after transfer", balanceOf.toString())
          balanceOf = await token.balanceOf(receiver)
          console.log("deployer balance after transfer", balanceOf.toString())

      })  
    })

})