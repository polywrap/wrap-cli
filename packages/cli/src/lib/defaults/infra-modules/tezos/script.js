const { up, down } = require('./index')

switch (process.argv[2]) {
    case 'up':
        up().catch((err) => {
            console.log(err)
            process.exit(1)
        })
        break
    case 'down': 
        down().catch((err) => {
            console.log(err)
            process.exit(1)
        })
        break
    default:
        console.log('> ', 'Invalid command.')
}