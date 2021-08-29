const BasicToken = artifacts.require("BasicToken");

contract('BasicToken', accounts => {
	const from = accounts[0]
	let basicToken

	before(async() => {
		basicToken = await BasicToken.new()
	})

	it('should return then name', async() => {
		// TODO
	})
})
