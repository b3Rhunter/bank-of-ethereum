import {useState} from 'react'
import heroImage from './images/bg.png';
import icon from './images/icon.png';
import { ethers } from 'ethers';
import ABI from './ABI.json';

const contractAddress = '0x86C6cdA1D3Be753e7E1298292E951ED2c44C5627'

function App() {
  const [name, setName] = useState("")
  const [connected, isConnected] = useState(false)
  const [amount, setAmount] = useState('');

  const connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const { ethereum } = window;
    if(ethereum) {
      const ensProvider = new ethers.providers.InfuraProvider('mainnet');
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const displayAddress = address?.substr(0, 6) + "...";
      const ens = await ensProvider.lookupAddress(address);
      if (ens !== null) {
        setName(ens)

      } else {
        setName(displayAddress)

      }
    } else {
      alert('no wallet detected!')
    }
    await signer.signMessage("Welcome to the Bank of Ethereum.");
    isConnected(true)
  }

  const deposit = async (amount) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
      await tx.wait();
    } catch (err) {
      console.error("Failed to deposit:", err);
    }
  }

  const withdraw = async (amount) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const tx = await contract.withdraw(ethers.utils.parseEther(amount));
      await tx.wait();
    } catch (err) {
      console.error("Failed to withdraw:", err);
    }
  }

  const handleDeposit = () => {
    deposit(amount);
};

const handleWithdraw = () => {
    withdraw(amount);
};

  return (
    <div className='app'>
      <img className='icon' src={icon} alt="logo"/>
      {connected && (
        <button className='connect' onClick={connect}>{name}</button>
      )}
      {!connected && (
        <button className='connect' onClick={connect}>Connect</button>
      )}
      
      <div className="content">
        <div className="left-column">
          
          <div className='controls'>
          <h1>Bank <span className='of'>of</span> <span class='ethereum'>Ethereum</span></h1>
          <hr/>
          <input
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          
          <button onClick={handleDeposit}>Deposit</button>
          <button onClick={handleWithdraw}>Withdraw</button>
          </div>

        </div>

        <div className="right-column">
          <img className='hero' src={heroImage} alt='hero' />
        </div>
      </div>
    </div>
  );
}

export default App;
