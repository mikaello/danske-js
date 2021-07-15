# danske-js

Parsing of PDF documents with account/transaction information from Danske Bank.

These kind of PDF documents are the ones you will get if you ask for
transactions years back in time, and the Danske Bank needs to manually extract
these for you.

## Usage

1. Clone this repo
   ```shell
   git clone https://github.com/mikaello/danske-js.git
   ```
2. Install with NPM:
   ```shell
   cd danske-js
   npm install
   ```
3. Add your Danske Bank transactions PDF to the project folder and name it
   `transactions.pdf`
4. Run either esbuild or TypeScript compiler with included execution with node:

   ```shell
   npm run es # esbuild + run with node
   ```

   or

   ```shell
   npm run ts # tsc + run with node
   ```
