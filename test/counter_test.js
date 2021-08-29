const Counter = artifacts.require("Counter")

contract('Counter', accounts => {
	const from = accounts[0]
	let counter

	before(async() => {
		counter = await Counter.new()
	})

	it('should add', async() => {
		await counter.add()
		let count = await counter.getCounter()
		assert(count == 1, `count was ${count}`)
	})
})