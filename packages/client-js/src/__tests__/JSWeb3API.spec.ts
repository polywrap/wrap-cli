import { JSWeb3APIDefinition} from '../lib/definitions';
import * as fs from 'fs';
import { TesterJSModule } from '../jsModules/Tester/tester';
import gql from 'graphql-tag';

describe("JS Web3API Modules", () => {

    const rawSchema = fs.readFileSync('./src/jsModules/Tester/schema.graphql').toString();

    it("can query a JS Web3 API", async () => {
        const def = new JSWeb3APIDefinition(rawSchema, () => {
            return TesterJSModule();
        });

        const keyToSet = 'hello';
        const expectedValue = 'world';

        const api = await def.create();
        const setQuery = gql`mutation {
            setValue(key: "${keyToSet}", value: "${expectedValue}")
        }`;
        
        let res = await api.query({query: setQuery});

        expect(res.data?.setValue).toStrictEqual(true);

        const getQuery = gql`query {
            getValue(key: "${keyToSet}")
        }`;
        
        res = await api.query({query: getQuery});

        expect(res.data?.getValue).toStrictEqual(expectedValue);
    });

})