import { build } from "gluegun";

interface args {
  [key: string]: any
} 
  
export const run = async (argv: args) => {
  const cli = build('w3')
    .src(`${__dirname}/..`)
    .plugins(`${process.cwd()}/w3/plugins`)
    .plugins(`${process.cwd()}/node_modules`, { matching: 'w3-*', hidden: true })
    .help()
    .create()

  return await cli.run(argv)
}