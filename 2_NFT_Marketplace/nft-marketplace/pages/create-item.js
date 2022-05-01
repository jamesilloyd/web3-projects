import { useState } from "react"
import { ethers } from 'ethers'
// Uploading and downloading files
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from "next/router"
import Web3Modal from 'web3modal'
import axios from 'axios'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    nftaddress, nftmarketaddress
} from '../config'

import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter()

    async function onChange(e) {
        console.log('onChange called')
    
        const file = e.target.files[0]

        try {
            const added = await client.add(
                file, 
                { 
                    progress: (prog) => console.log(`received: ${prog}`) 
                }
                    )

            const url = `https://ipfs.infura.io/ipfs/${added.path}`

            console.log(url)

            setFileUrl(url)

        } catch (e) {
            console.log('error',e)
        }


    }

    async function createItem() {
        console.log('createItem called')
        console.log(formInput)
        console.log(fileUrl)
        const { name, description, price } = formInput
        if (!name || !description || !price || !fileUrl) return
        const data = JSON.stringify({
            name, description, image: fileUrl
        })

        console.log(data)

        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            // After file is uploaded to IPFS, pass the URL to save it on Polygon
            
            console.log('url: ',url)
            
            return url
        } catch (e) {
            console.log('Error uploading file: ', error)
        }
    }

    async function createSale() {
        console.log('createSale called')
        let url = await createItem()
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        console.log('here')
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()

        console.log('here2')
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        

        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        console.log('here3')

        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        console.log('here4')
        console.log('tokenId: ',tokenId)
        console.log('price: ',price.toString())
        console.log('marketaddress: ',nftmarketaddress)
        console.log('listingPrice: ',listingPrice)

        transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
        await transaction.wait()

        console.log('here5')

        // send back to main page
        router.push('/')

    }

    return (

        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <input
                    placeholder="Asset Name"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <textarea
                    placeholder="Asset Description"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
                <input
                    placeholder="Asset Price in Matic"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
                <input
                    type="file"
                    name="Asset"
                    className="my-4"
                    onChange={onChange}
                />
                {
                    fileUrl && (
                    <img className="rounded mt-4" width="350" src={fileUrl}/>
                    )

                }
                <button
                    onClick={createSale}
                    className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Create Digital Asset
                </button>
            </div>
        </div>
    )


}


