import { 
  Web3Button,
  useContract, 
  useContractRead,
  useNFTs,
  ThirdwebNftMedia,
  useAddress,
 } from "@thirdweb-dev/react";
import { useState } from 'react';
import styles from "../styles/Home.module.css";
import { Input } from 'antd';
const { Search } = Input
const FormControls = ({onSubmit}) => {
    return (
        <Search placeholder='Enter Word' onSearch={onSubmit} enterButton
        style={{
            width: 300,
        }}/>
    )
      }
//const contractAddressNFT = "0x9BC2Fc92EF2cE31a03De0df3375439376b391b7C"
const contractAddressNFT = "0xDbf89Cf00dA32466a0cB095826F314Dae437Bc72"
const contractAddressPT = "0x37E8BE627817a3A5ef82cF27f0df000F29A083B6"
const tokenAmount = 1;


export default function Home() {
  const { contract } = useContract(contractAddressNFT);
  const { contractPT } = useContract(contractAddressPT, "PT");

  const { data: nfts, isLoading, error } = useNFTs(contract);
  const { data: contractName } = useContractRead(contract, "name");
  const { data: contractNamePT } = useContractRead(contractPT, "name");

  const address = useAddress()
  //console.log(address);
 // console.log(contractNamePT);

 const [uniqueWord, setUniqueWord] = useState(null)
 const onSubmit = (values) => {
     setUniqueWord(values)
 }

  const metadata = {
    name: uniqueWord,
    description: "This is a cool NFT",
    image: ("https://portal.thirdweb.com/img/thirdweb-logo-transparent-white.svg"), // This can be an image url or file
  }

  const metadataWithSupply = {
    metadata,
    supply: 1, // The number of this NFT you want to mint

  }

  return (
    
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://thirdweb.com/">WordMint</a>!

        </h1>

        <p className={styles.description}>
          Get started by creating a new word!
        </p>
        <div>
        <div style={{width: '100%', margin: 'auto'}}></div>
              <FormControls onSubmit={onSubmit}/>
        </div>
        <div className={styles.code}>
          <Web3Button
            contractAddress={contractAddressNFT}   
            action={(contract) => {
              contract.erc1155.mint(metadataWithSupply)
              }}
          >
              Mint a Word
          </Web3Button>
        </div>
        <div className={styles.code}>
          <Web3Button
            contractAddress={contractAddressPT}
            action={(contractPT) =>
              contractPT.erc20.mint(tokenAmount)
            }
          >
            Mint Coins
          </Web3Button>
        </div>
      </main>
    </div>
  );
}
