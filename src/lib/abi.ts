// Bu dosya, deploy ettiğiniz sözleşmenin Adresini ve ABI'sini
// uygulamamızın erişebilmesi için dışa aktarır (export).

// Aşama 7'de edindiğiniz deploy edilmiş sözleşme adresi
export const contractAddress = '0xBc1bf5b2f5F4Bd5c0197049DE85314BEca18A824';

// Aşama 7'de Remix'ten kopyaladığınız sözleşme ABI'si
export const contractAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "pollId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "optionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "Voted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pollId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "optionId",
				"type": "uint256"
			}
		],
		"name": "getVoteCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "pollOptions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pollId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "optionId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
] as const; // 'as const' eklemek, wagmi'nin tipleri daha iyi anlaması için önemlidir.