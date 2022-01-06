const Token = artifacts.require("./Token");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', (accounts) => {
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
            result.should.equal('Dip')
        })

        it('tracks the symbol', async () => {
            const result = await token.symbol()
            result.should.equal('DIP')
        })

        it('tracks the decimals', async () => {
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        })

        it('tracks the totalSupply', async () => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply)
        })
    })
})