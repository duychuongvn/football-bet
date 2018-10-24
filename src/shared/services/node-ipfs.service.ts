/**
 * Create Ipfs node server
 * Date: 2018/10/20 10:21
 * Version: v0.1
 *
 * Install:
 *  IPFS: yarn add ipfs or npm install ipfs async --save
 *  Buffer: yarn add buffer or npm install buffer --save
 */
const ipfs = require('ipfs');
const Buffer = require('buffer').Buffer;

export interface IPFSNode {
  hash: string,
  path: string,
  size: number
}

class NodeIPFSService {
  node: any;

  initIPFS() {
    this.node = new ipfs();
  }

  // Get version of IPFS
  getVersion() {
    return this.node.version();
  }

  // Add a file in IPFS
  addNode(filename: string, nodeData: string | object | Array<object|string>): IPFSNode[] {
    return this.node.files.add({
      path: filename,
      content: (typeof nodeData === "string") ? nodeData : Buffer.from(JSON.stringify(nodeData))
    })
  }

  // Read the file from IPFS
  getNode(hash: string) {
    return this.node.files.cat(hash).then((res: any) => {
      return JSON.parse(new TextDecoder("utf-8").decode(res));
    })
  }

}

export default new NodeIPFSService();
