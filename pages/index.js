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

//Form for inputting the users word
const FormControls = ({onSubmit}) => {
    return (
        <Search placeholder='Enter Word' onSearch={onSubmit} enterButton
        style={{
            width: 300,
        }}/>
    )
      }

//ERC1155 Contract Address for wordmint
const contractAddress = "0xE4D38bEa73B7c763915e0b12C2d0cF8DCA4B8aa5"

const apiKey = "cqt_rQdbVQjQ6R37gcwCJm9cDdgmBypW"

export default function Home() {

  //const to read contract address

  const { contract } = useContract(contractAddress);

  //ERC1155 Contract Address for wordmint

  //const to read connected wallet address
  const address = useAddress()


  //function to fetch NFT contract data from Covalent API
    const getDataFromCovalentAPI = async () => {
      const getNFTMetadata = 'https://api.covalenthq.com/v1/fantom-mainnet/nft/0xE4D38bEa73B7c763915e0b12C2d0cF8DCA4B8aa5/metadata/?no-metadata=true&with-uncached=true&key=cqt_rQdbVQjQ6R37gcwCJm9cDdgmBypW'
      const res = await fetch(getNFTMetadata, {method: 'GET', headers: {
        "Authorization": `Basic ${btoa(apiKey + ':')}`
      }})
      return res.json()
    }

    //function to check unique word inputted by the user already exists in the NFT contract
    const getNFTData = ( trait, res ) => {
      const match = res.data.items.find(item => trait === item.nft_data.external_data.name)
      if (match) {
          console.log("Phrase exists in the contract.")
      } else {
          console.log("Phrase does not exist in the contract.")
      }
  }
    const main = async () => {
      const trait = uniqueWord
      const data = await getDataFromCovalentAPI()
      getNFTData(trait, data)
  }


const [uniqueWord, setUniqueWord] = useState(null)

//onSubmit does two things:
//1. sets the constant unique word and 
//2. then calls the main function to fetch data from API and check if the word already exists in the contract.
const onSubmit = (values) => {
    setUniqueWord(values)
    main()
}
  //constant to define the parameters for the NFT
  const metadata = {
    name: uniqueWord,
    description: "This is a cool word",
    attributes: [{trait_type:"Word", value:uniqueWord}]
  }

  //constant to define the structure the NFT metadata with suplly (supply = 1) to avoid batch minting.
  const metadataWithSupply = {
    metadata,
    supply: 1, // The number of this NFT you want to mint

  }

  return (
    
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/IndranilJaiswal/fantomdapp">PhraseMint</a>!

        </h1>
        <p className={styles.description}>
          Get started by creating a new word in the search bar!
        </p>
        <p className={styles.description}>
          Click on the search icon to check if your word has already been minted
        </p>
        <div>
        <div style={{width: '100%', margin: 'auto'}}></div>
              <FormControls onSubmit={onSubmit}/>
        </div>
        <div className={styles.code}>
          <Web3Button
          //button to mint the new word
            contractAddress={contractAddress}   
            action={(contract) => {
              contract.erc1155.mint(metadataWithSupply)
              }}
          >
              Mint a Word
          </Web3Button>
        </div>
      </main>
    </div>
  );
}
