import chalk from 'chalk';
import { table } from 'table';

export class NameLogger{
  constructor({sha3, namehash,}){
    this.data = {}
    this.sha3 = sha3
    this.namehash = namehash
  }

  record(name, values){
    this.data[name] = values
  }

  generateTable(){
    let contractNames = Object.keys(this.data)
    let contractAddressesTable = contractNames.map((key)=>{
      let label = this.data[key].label
      let status = this.data[key].migrated ? chalk.green('yes') : chalk.red('no')
      return [key, this.namehash(key) , label, this.sha3(label), status]
    })
    contractAddressesTable.unshift(['domain', 'namehash of domain', 'label', 'labelhash', 'migrated'])
    this.contractAddressesTable = contractAddressesTable
    return contractAddressesTable
  }

  print(){
    let config = {
      columns: {
        0: {
          alignment: 'left',
          width: 20
        },
        1: {
          alignment: 'center',
          width: 66
        },
        2: {
          alignment: 'left',
          width: 15
        },
        3: {
          alignment: 'center',
          width: 66
        },
        4: {
          alignment: 'left',
          width: 10
        }
      }
    };
    return table(this.contractAddressesTable, config);
  }
}
