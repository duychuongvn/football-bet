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
    const repoPath = 'ipfs-' + Math.random();

    this.node = new ipfs({
      repo: repoPath,
      config: {
        Addresses: {
          Swarm: [
            '/ip4/127.0.0.1/tcp/4001/ws/p2p-websocket-star/',
            '/ip4/127.0.0.1/tcp/4001/ws/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
            '/ip4/192.168.0.2/tcp/4001/ws/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM'
          ]
        }
      }
    });

    this.node.on('ready', () => console.log('Online status: ', this.node.isOnline() ? 'online' : 'offline'));
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
